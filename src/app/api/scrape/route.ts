import { Low } from "lowdb";
import { JSONFilePreset } from "lowdb/node";
import { Browser, chromium, Page } from "playwright";

import { IAssignment } from "@/lib/scrape-response";

import { scrapeASociety } from "./scrapers/a-society-scraper";
import { scrapeAliant } from "./scrapers/aliant-scraper";
import { scrapeAmendo } from "./scrapers/amendo-scraper";
import { scrapeBiolit } from "./scrapers/biolit-scraper";
import { scrapeCinode } from "./scrapers/cinode-scraper";
import { scrapeCombitech } from "./scrapers/combitech-scraper";
import { scrapeEmagine } from "./scrapers/emagine-scraper";
import { scrapeEpico } from "./scrapers/epico-scraper";
import { scrapeExperis } from "./scrapers/experis-scraper";
import { scrapeFunctionalSoftware } from "./scrapers/functional-software-scraper";
import { scrapeGameBoost } from "./scrapers/game-boost-scraper";
import { scrapeGreateIT } from "./scrapers/great-it-scraper";
import { scrapeHouseOfSkills } from "./scrapers/house-of-skills-scraper";
import { scrapeIceberry } from "./scrapers/iceberry-scraper";
import { scrapeItcNetwork } from "./scrapers/itc-network-scraper";
import { scrapeJappa } from "./scrapers/jappa-scraper";
import { scrapeKantur } from "./scrapers/kantur-scraper";
import { scrapeKeyman } from "./scrapers/keyman-scraper";
import { scrapeKoalitionen } from "./scrapers/koalitionen-scraper";
import { scrapeKonsultfabriken } from "./scrapers/konsultfabriken-scraper";
import { scrapeLevigo } from "./scrapers/levigo-scraper";
import { scrapeNexer } from "./scrapers/nexer-scraper";
import { scrapePaventia } from "./scrapers/paventia-scraper";
import { scrapeRandstad } from "./scrapers/randstad-scraper";
import { scrapeRegent } from "./scrapers/regent-scraper";
import { scrapeResursbrist } from "./scrapers/resursbrist-scraper";
import { scrapeSafemind } from "./scrapers/safemind-scraper";
import { scrapeSenterprise } from "./scrapers/senterprise-scraper";
import { scrapeSigma } from "./scrapers/sigma-scraper";
import { scrapeTeksystems } from "./scrapers/teksystems-scraper";
import { scrapeUpgraded } from "./scrapers/upgraded-scraper";
import { scrapeVerama } from "./scrapers/verama-scraper";
import { scrapeWittedPartners } from "./scrapers/witted-partners-scraper";

export async function GET() {
  const browser = await chromium.launch({ headless: true });
  const database = await JSONFilePreset<IAssignment[]>("./public/assignments.json", []);
  const existingKeys = database.data.map((assignment) => `${assignment.source}-${assignment.id}`);

  try {
    const results1 = await Promise.allSettled([
      runScraper(scrapeASociety, existingKeys, browser),
      runScraper(scrapeAliant, existingKeys, browser),
      runScraper(scrapeAmendo, existingKeys, browser),
      runScraper(scrapeBiolit, existingKeys, browser),
      runScraper(scrapeCinode, existingKeys, browser),
      runScraper(scrapeCombitech, existingKeys, browser),
      runScraper(scrapeEmagine, existingKeys, browser),
      runScraper(scrapeEpico, existingKeys, browser),
      runScraper(scrapeExperis, existingKeys, browser),
      runScraper(scrapeFunctionalSoftware, existingKeys, browser),
    ]);

    const results2 = await Promise.allSettled([
      runScraper(scrapeGameBoost, existingKeys, browser),
      runScraper(scrapeGreateIT, existingKeys, browser),
      runScraper(scrapeHouseOfSkills, existingKeys, browser),
      runScraper(scrapeIceberry, existingKeys, browser),
      runScraper(scrapeItcNetwork, existingKeys, browser),
      runScraper(scrapeJappa, existingKeys, browser),
      runScraper(scrapeKantur, existingKeys, browser),
      runScraper(scrapeKeyman, existingKeys, browser),
      runScraper(scrapeKoalitionen, existingKeys, browser),
      runScraper(scrapeKonsultfabriken, existingKeys, browser),
    ]);

    const results3 = await Promise.allSettled([
      runScraper(scrapeLevigo, existingKeys, browser),
      runScraper(scrapeNexer, existingKeys, browser),
      runScraper(scrapePaventia, existingKeys, browser),
      runScraper(scrapeRandstad, existingKeys, browser),
      runScraper(scrapeRegent, existingKeys, browser),
      runScraper(scrapeResursbrist, existingKeys, browser),
      runScraper(scrapeSafemind, existingKeys, browser),
      runScraper(scrapeSenterprise, existingKeys, browser),
      runScraper(scrapeSigma, existingKeys, browser),
      runScraper(scrapeTeksystems, existingKeys, browser),
    ]);

    const results4 = await Promise.allSettled([
      runScraper(scrapeUpgraded, existingKeys, browser),
      runScraper(scrapeVerama, existingKeys, browser),
      runScraper(scrapeWittedPartners, existingKeys, browser),
    ]);

    const results = [...results1, ...results2, ...results3, ...results4];

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
