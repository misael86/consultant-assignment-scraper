import { Low } from "lowdb";
import { JSONFilePreset } from "lowdb/node";
import { Browser, chromium, Page } from "playwright";

import filters from "@/context/filters.json";

import { IAssignment } from "./scrape-response";
import { scrapeASociety } from "./scrapers/a-society-scraper";
import { scrapeAliant } from "./scrapers/aliant-scraper";
import { scrapeBiolit } from "./scrapers/biolit-scraper";
import { scrapeCinode } from "./scrapers/cinode-scraper";
import { scrapeVerama } from "./scrapers/verama-scraper";

export async function scrapeAssignments() {
  const browser = await chromium.launch();
  const database = await JSONFilePreset<IAssignment[]>("./src/context/assignments.json", []);

  try {
    const results = await Promise.allSettled([
      runScraper(
        scrapeASociety,
        database.data.filter((assignment) => assignment.source === "a-society").map((assignment) => assignment.key),
        browser
      ),
      runScraper(
        scrapeAliant,
        database.data.filter((assignment) => assignment.source === "aliant").map((assignment) => assignment.key),
        browser
      ),
      runScraper(
        scrapeBiolit,
        database.data.filter((assignment) => assignment.source === "biolit").map((assignment) => assignment.key),
        browser
      ),
      runScraper(
        scrapeCinode,
        database.data.filter((assignment) => assignment.source === "cinode").map((assignment) => assignment.key),
        browser
      ),
      runScraper(
        scrapeVerama,
        database.data.filter((assignment) => assignment.source === "verama").map((assignment) => assignment.key),
        browser
      ),
    ]);

    let successfulAssignments = results
      .filter((result) => result.status === "fulfilled")
      .flatMap((result) => result.value);

    successfulAssignments = await store(successfulAssignments, database);
    successfulAssignments = sort(successfulAssignments);
    successfulAssignments = tag(successfulAssignments);

    return successfulAssignments;
  } finally {
    await browser.close();
  }
}

async function runScraper(
  scraper: (page: Page, storedAssignmentIds: string[]) => Promise<IAssignment[]>,
  storedAssignmentIds: string[],
  browser: Browser
) {
  const page = await browser.newPage();
  const assingments = await scraper(page, storedAssignmentIds);
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
  for (const assignment of assignments) {
    if (database.data.some((item) => item.key === assignment.key && item.source === assignment.source)) continue;
    database.data.push(assignment);
  }
  await database.write();
  return database.data;
}

function tag(assignments: IAssignment[]): IAssignment[] {
  return assignments.map((assignment) => {
    const lowerCaseTitle = assignment.title.toLowerCase();
    assignment.isA11y = filters.a11y.some((filter) => lowerCaseTitle.includes(filter.toLowerCase()));
    assignment.isDev = filters.dev.some((filter) => lowerCaseTitle.includes(filter.toLowerCase()));
    assignment.isUX = filters.ux.some((filter) => lowerCaseTitle.includes(filter.toLowerCase()));
    return assignment;
  });
}
