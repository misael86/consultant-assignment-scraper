import { WebSocketServer, WebSocket } from "ws";
import { chromium, Browser, Page } from "playwright";
import { scrapers } from "./scrapers/index.js";
import { getDatabase, storeAssignments } from "./store/index.js";
import { IAssignment } from "./types.js";

const PORT = 8080;
const wss = new WebSocketServer({ port: PORT });

console.log(`WebSocket server started on port ${PORT}`);

wss.on("connection", (ws) => {
  console.log("Client connected");

  ws.on("message", async (message) => {
    try {
      const data = JSON.parse(message.toString());
      if (data.type === "start_scrape") {
        console.log("Starting scrape...");
        ws.send(JSON.stringify({ type: "status", status: "scraping_started" }));
        
        await runScrapingProcess(ws);
        
        ws.send(JSON.stringify({ type: "status", status: "scraping_completed" }));
      }
    } catch (error) {
      console.error("Error handling message:", error);
      ws.send(JSON.stringify({ type: "error", message: "Invalid message format" }));
    }
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

async function runScrapingProcess(ws: WebSocket) {
  const browser = await chromium.launch({ headless: true });
  try {
    const database = await getDatabase();
    const existingKeys = database.data.map((assignment) => `${assignment.source}-${assignment.id}`);

    const results = await runScrapersInParallell(scrapers, existingKeys, browser, ws);

    const successfulAssignments = results
      .filter((result): result is PromiseFulfilledResult<IAssignment[]> => result.status === "fulfilled")
      .flatMap((result) => result.value);

    // Notify about count
    ws.send(JSON.stringify({ 
      type: "stats", 
      scraped_count: successfulAssignments.length,
      total_sources: results.length 
    }));

    if (successfulAssignments.length > 0) {
      await storeAssignments(successfulAssignments, database);
      // Send new assignments to client
      ws.send(JSON.stringify({ type: "new_assignments", assignments: successfulAssignments }));
    }

  } catch (error) {
    console.error("Scraping process failed:", error);
    ws.send(JSON.stringify({ type: "error", message: "Scraping process failed" }));
  } finally {
    await browser.close();
  }
}

async function runScraper(
  scraper: (page: Page, existingKeys: string[]) => Promise<IAssignment[]>,
  existingKeys: string[],
  browser: Browser
) {
  let assignments: IAssignment[] = [];
  let retry = true;
  let retryCount = 3;
  while (retry && retryCount > 0) {
    retry = false;
    const page = await browser.newPage();
    try {
      assignments = await scraper(page, existingKeys);
    } catch (error) {
      retry = true;
      retryCount--;
      if (retryCount === 0) throw error;
    }
    await page.close();
  }
  return [...assignments].reverse(); // Check if strict mode allows toReversed (ES2023)
}

async function runScrapersInParallell(
  scrapers: ((page: Page, existingKeys: string[]) => Promise<IAssignment[]>)[],
  existingKeys: string[],
  browser: Browser,
  ws: WebSocket
) {
  const results: PromiseSettledResult<IAssignment[]>[] = [];

  let index = 0;
  const nrScrapers = scrapers.length;
  // Send total count to client so they can show progress bar
  ws.send(JSON.stringify({ type: "progress_init", total: nrScrapers }));

  while (index < nrScrapers) {
    const batch = scrapers.slice(index, index + 10);
    const promises = batch.map(async (scraper) => {
        try {
            const res = await runScraper(scraper, existingKeys, browser);
             ws.send(JSON.stringify({ type: "progress_update", completed: 1 })); // Increment
            return res;
        } catch (e) {
             ws.send(JSON.stringify({ type: "progress_update", completed: 1 }));
             throw e;
        }
    });
    
    const partialResults = await Promise.allSettled(promises);
    results.push(...partialResults);
    index += 10;
  }

  return results;
}
