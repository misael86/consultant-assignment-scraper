import { Low } from "lowdb";
import { JSONFilePreset } from "lowdb/node";
import { Browser, chromium, Page } from "playwright";

import { IAssignment } from "./scrape-response";
import { scrapeASociety } from "./scrapers/a-society-scraper";
import { scrapeAliant } from "./scrapers/aliant-scraper";
import { scrapeBiolit } from "./scrapers/biolit-scraper";
import { scrapeCinode } from "./scrapers/cinode-scraper";
import { scrapeVerama } from "./scrapers/verama-scraper";

export async function scrapeAssignments() {
  const browser = await chromium.launch();
  const database = await JSONFilePreset<IAssignment[]>("./src/context/assignments.json", []);
  const existingKeys = new Set(database.data.map((assignment) => `${assignment.source}-${assignment.id}`));

  try {
    const results = await Promise.allSettled([
      runScraper(scrapeASociety, existingKeys, browser),
      runScraper(scrapeAliant, existingKeys, browser),
      runScraper(scrapeBiolit, existingKeys, browser),
      runScraper(scrapeCinode, existingKeys, browser),
      runScraper(scrapeVerama, existingKeys, browser),
    ]);

    let successfulAssignments = results
      .filter((result) => result.status === "fulfilled")
      .flatMap((result) => result.value);

    if (results.filter((result) => result.status === "rejected")) console.log("Some scrapers failed", results);

    successfulAssignments = await store(successfulAssignments, database);
    successfulAssignments = sort(successfulAssignments);

    return successfulAssignments;
  } finally {
    await browser.close();
  }
}

async function runScraper(
  scraper: (page: Page, existingKeys: Set<string>) => Promise<IAssignment[]>,
  existingKeys: Set<string>,
  browser: Browser
) {
  const page = await browser.newPage();
  const assingments = await scraper(page, existingKeys);
  await page.close();
  return assingments;
}

function sort(assignments: IAssignment[]) {
  return assignments.toSorted((a, b) => {
    if (a.scraped < b.scraped) {
      return 1;
    }
    if (a.scraped > b.scraped) {
      return -1;
    }
    return 0;
  });
}

async function store(assignments: IAssignment[], database: Low<IAssignment[]>): Promise<IAssignment[]> {
  database.data.push(...assignments);
  await database.write();
  return database.data;
}
