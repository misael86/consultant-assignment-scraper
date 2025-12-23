import { Low } from "lowdb";
import { Browser, chromium, Page } from "playwright";
import { WebSocket, WebSocketServer } from "ws";

import { scrapers } from "./libs/scrapers/index";
import { sendScrapingCompleted } from "./libs/socketResponses/send-scraping-completed";
import { sendScrapingError } from "./libs/socketResponses/send-scraping-error";
import { sendScrapingNewAssignments } from "./libs/socketResponses/send-scraping-new-assignments";
import { sendScrapingProgressInit } from "./libs/socketResponses/send-scraping-progress-init";
import { sendScrapingProgressUpdate } from "./libs/socketResponses/send-scraping-progress-update";
import { sendScrapingStarted } from "./libs/socketResponses/send-scraping-started";
import { IAssignment } from "./models/assignment";
import { getDatabase, storeAssignments } from "./store/index";

const PORT = 8080;
const webSocketServer = new WebSocketServer({ port: PORT });

console.log(`WebSocket server started on port ${PORT}`);

webSocketServer.on("connection", (webSocket) => {
  console.log("Client connected");

  webSocket.on("message", (message) => {
    try {
      const data = JSON.parse(message.toString());
      if (data.type === "start_scrape") {
        console.log("Starting scrape...");
        sendScrapingStarted(webSocket);
        runScrapingProcess(webSocket);
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
  return [...assignments].toReversed(); // Check if strict mode allows toReversed (ES2023)
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
    } catch (error) {
      sendScrapingProgressUpdate(webSocket, 1);
      throw error;
    }
  });

  await Promise.all(promises);
}

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
