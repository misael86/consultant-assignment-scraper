import { Low } from "lowdb";
import { JSONFilePreset } from "lowdb/node";
import { Browser, chromium, Page } from "playwright";

import { IAssignment } from "@/lib/scrape-response";

import { scrapeASociety } from "./scrapers/a-society-scraper";
import { scrapeAliant } from "./scrapers/aliant-scraper";
import { scrapeBiolit } from "./scrapers/biolit-scraper";
import { scrapeCinode } from "./scrapers/cinode-scraper";
import { scrapeCombitech } from "./scrapers/combitech-scraper";
import { scrapeEpico } from "./scrapers/epico-scraper";
import { scrapeExperis } from "./scrapers/experis-scraper";
import { scrapeFunctionalSoftware } from "./scrapers/functional-software-scraper";
import { scrapeGameBoost } from "./scrapers/game-boost-scraper";
import { scrapeVerama } from "./scrapers/verama-scraper";

export async function GET() {
  const browser = await chromium.launch({ headless: true });
  const database = await JSONFilePreset<IAssignment[]>("./public/assignments.json", []);
  const existingKeys = database.data.map((assignment) => `${assignment.source}-${assignment.id}`);

  try {
    const results = await Promise.allSettled([
      runScraper(scrapeASociety, existingKeys, browser),
      runScraper(scrapeAliant, existingKeys, browser),
      runScraper(scrapeBiolit, existingKeys, browser),
      runScraper(scrapeCinode, existingKeys, browser),
      runScraper(scrapeCombitech, existingKeys, browser),
      runScraper(scrapeEpico, existingKeys, browser),
      runScraper(scrapeExperis, existingKeys, browser),
      runScraper(scrapeFunctionalSoftware, existingKeys, browser),
      runScraper(scrapeGameBoost, existingKeys, browser),
      runScraper(scrapeVerama, existingKeys, browser),
    ]);
    const rejectedAssignments = results.filter((result) => result.status !== "fulfilled");

    if (rejectedAssignments.length > 0)
      console.log(
        "Some scrapers failed",
        results.filter((result) => result.status !== "fulfilled")
      );

    const successfulAssignments = results
      .filter((result) => result.status === "fulfilled")
      .flatMap((result) => result.value);

    console.log("Scraped sources count:", results.filter((result) => result.status === "fulfilled").length);
    console.log("Scraped assignments count:", successfulAssignments.length);

    await store(successfulAssignments, database);

    return Response.json(successfulAssignments);
  } finally {
    await browser.close();
  }
}

async function runScraper(
  scraper: (page: Page, existingKeys: string[]) => Promise<IAssignment[]>,
  existingKeys: string[],
  browser: Browser
) {
  const page = await browser.newPage();
  const assingments = await scraper(page, existingKeys);
  await page.close();
  return assingments;
}

async function store(assignments: IAssignment[], database: Low<IAssignment[]>): Promise<void> {
  database.data.push(...assignments);
  await database.write();
}
