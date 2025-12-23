import { WebSocketServer, WebSocket } from "ws";
import { chromium, Browser, Page } from "playwright";
import { scrapers } from "./libs/scrapers/index.js";
import { getDatabase, storeAssignments } from "./store/index.js";
import { IAssignment } from "./models/assignment.js";
import { Low } from "lowdb";
import { sendScrapingCompleted } from "./libs/socketResponses/sendScrapingCompleted.js";
import { sendScrapingError } from "./libs/socketResponses/sendScrapingError.js";
import { sendScrapingNewAssignments } from "./libs/socketResponses/sendScrapingNewAssignments.js";
import { sendScrapingProgressInit } from "./libs/socketResponses/sendScrapingProgressInit.js";
import { sendScrapingProgressUpdate } from "./libs/socketResponses/sendScrapingProgressUpdate.js";
import { sendScrapingStarted } from "./libs/socketResponses/sendScrapingStarted.js";

const PORT = 8080;
const webSocketServer = new WebSocketServer({ port: PORT });

console.log(`WebSocket server started on port ${PORT}`);

webSocketServer.on("connection", (webSocket) => {
  console.log("Client connected");

  webSocket.on("message", async (message) => {
    try {
      const data = JSON.parse(message.toString());
      if (data.type === "start_scrape") {
        console.log("Starting scrape...");
        sendScrapingStarted(webSocket);

        await runScrapingProcess(webSocket);

        sendScrapingCompleted(webSocket);
      }
    } catch (error) {
      console.error("Error handling message:", error);
      sendScrapingError(webSocket, "Invalid message format");
    }
  });

  webSocket.on("close", () => {
    console.log("Client disconnected");
  });
});

async function runScrapingProcess(webSocket: WebSocket) {
  const browser = await chromium.launch({ headless: true });
  try {
    const database = await getDatabase();
    const existingKeys = database.data.map((assignment) => `${assignment.source}-${assignment.id}`);
    await runScrapers(scrapers, existingKeys, browser, webSocket, database);
  } catch (error) {
    console.error("Scraping process failed:", error);
    sendScrapingError(webSocket, "Scraping process failed");
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

async function runScrapers(
  scrapers: ((page: Page, existingKeys: string[]) => Promise<IAssignment[]>)[],
  existingKeys: string[],
  browser: Browser,
  webSocket: WebSocket,
  database: Low<IAssignment[]>
) {
  const nrScrapers = scrapers.length;
  // Send total count to client so they can show progress bar
  sendScrapingProgressInit(webSocket, nrScrapers);

  const promises = scrapers.map(async (scraper) => {
    try {
      const assignments = await runScraper(scraper, existingKeys, browser);
      sendScrapingProgressUpdate(webSocket, 1);
      sendScrapingNewAssignments(webSocket, assignments);
      await storeAssignments(assignments, database);
    } catch (e) {
      throw e;
    }
  });

  await Promise.all(promises);
}
