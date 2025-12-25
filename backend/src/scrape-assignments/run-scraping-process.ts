import { IAssignment } from "@shared/assignment";
import { Low } from "lowdb";
import { JSONFilePreset } from "lowdb/node";
import { Browser, chromium, Page } from "playwright";
import { WebSocket } from "ws";

import { sendEvent } from "@/libs/send-event";
import { scrapers } from "@/scrape-assignments/scrapers";

export async function runScrapingProcess(webSocket: WebSocket) {
  const browser = await chromium.launch({ headless: true });
  try {
    sendEvent(webSocket, { totalScrapers: scrapers.length, type: "scraping_started" });
    await runAllScrapers(webSocket, browser);
  } catch (error) {
    console.error("Scraping process failed:", error);
    sendEvent(webSocket, { message: "Scraping process failed", type: "error" });
  } finally {
    await browser.close();
    sendEvent(webSocket, { type: "scraping_completed" });
  }
}

async function getDatabaseAndExistingKeys() {
  const database = await JSONFilePreset<IAssignment[]>("../shared/assignments.json", []);
  const existingKeys = database.data.map((assignment) => `${assignment.source}-${assignment.id}`);
  return { database, existingKeys };
}

async function runAllScrapers(webSocket: WebSocket, browser: Browser) {
  const { database, existingKeys } = await getDatabaseAndExistingKeys();

  const promises = scrapers.map(async (scraper) => {
    const assignments = await runScraper(scraper, existingKeys, browser);
    sendEvent(webSocket, { assignments, type: "new_assignments" });
    await storeAssignments(assignments, database);
  });

  await Promise.allSettled(promises);
}

async function runScraper(
  scraper: (page: Page, existingKeys: string[]) => Promise<IAssignment[]>,
  existingKeys: string[],
  browser: Browser
) {
  let assignments: IAssignment[] = [];
  let retryCount = 10;
  const page = await browser.newPage();

  while (retryCount > 0) {
    try {
      assignments = await scraper(page, existingKeys);
      break;
    } catch (error) {
      retryCount--;
      if (retryCount === 0) throw error;
    }
  }

  await page.close();
  return assignments.toReversed();
}

async function storeAssignments(assignments: IAssignment[], database: Low<IAssignment[]>): Promise<void> {
  database.data.push(...assignments);
  await database.write();
}
