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
import { scrapeMagello } from "./scrapers/magello-scraper";
import { scrapeNexer } from "./scrapers/nexer-scraper";
import { scrapeNikita } from "./scrapers/nikita-scraper";
import { scrapePaventia } from "./scrapers/paventia-scraper";
import { scrapeProfinder } from "./scrapers/profinder-scraper";
import { scrapeRandstad } from "./scrapers/randstad-scraper";
import { scrapeRegent } from "./scrapers/regent-scraper";
import { scrapeResursbrist } from "./scrapers/resursbrist-scraper";
import { scrapeRightPeopleGroup } from "./scrapers/right-people-group-scraper";
import { scrapeSafemind } from "./scrapers/safemind-scraper";
import { scrapeSeequaly } from "./scrapers/seequaly-scraper";
import { scrapeSenterprise } from "./scrapers/senterprise-scraper";
import { scrapeSigma } from "./scrapers/sigma-scraper";
import { scrapeTechrelations } from "./scrapers/techrelations-scraper";
import { scrapeTeksystems } from "./scrapers/teksystems-scraper";
import { scrapeTingent } from "./scrapers/tingent-scraper";
import { scrapeTogetherTech } from "./scrapers/together-tech-scraper";
import { scrapeUpgraded } from "./scrapers/upgraded-scraper";
import { scrapeVerama } from "./scrapers/verama-scraper";
import { scrapeWiseIT } from "./scrapers/wise-it-scraper";
import { scrapeWittedPartners } from "./scrapers/witted-partners-scraper";

export async function GET() {
  const browser = await chromium.launch({ headless: true });
  const database = await JSONFilePreset<IAssignment[]>("./public/assignments.json", []);
  const existingKeys = database.data.map((assignment) => `${assignment.source}-${assignment.id}`);

  const scrapers = [
    scrapeASociety,
    scrapeAliant,
    scrapeAmendo,
    scrapeBiolit,
    scrapeCinode,
    scrapeCombitech,
    scrapeEmagine,
    scrapeEpico,
    scrapeExperis,
    scrapeFunctionalSoftware,
    scrapeGameBoost,
    scrapeGreateIT,
    scrapeHouseOfSkills,
    scrapeIceberry,
    scrapeItcNetwork,
    scrapeJappa,
    scrapeKantur,
    scrapeKeyman,
    scrapeKoalitionen,
    scrapeKonsultfabriken,
    scrapeLevigo,
    scrapeMagello,
    scrapeNexer,
    scrapeNikita,
    scrapePaventia,
    scrapeProfinder,
    scrapeRandstad,
    scrapeRegent,
    scrapeResursbrist,
    scrapeRightPeopleGroup,
    scrapeSafemind,
    scrapeSenterprise,
    scrapeSeequaly,
    scrapeSigma,
    scrapeTechrelations,
    scrapeTeksystems,
    scrapeTingent,
    scrapeTogetherTech,
    scrapeUpgraded,
    scrapeVerama,
    scrapeWiseIT,
    scrapeWittedPartners,
  ];

  try {
    const results = await runScrapersInParallell(scrapers, existingKeys, browser);

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
  return assignments.toReversed();
}

async function runScrapersInParallell(
  scrapers: ((page: Page, existingKeys: string[]) => Promise<IAssignment[]>)[],
  existingKeys: string[],
  browser: Browser
) {
  const results = [];

  let index = 0;
  const nrScrapers = scrapers.length;
  while (index < nrScrapers) {
    const promises = scrapers.slice(index, index + 10).map((scraper) => runScraper(scraper, existingKeys, browser));
    const partialResults = await Promise.allSettled(promises);
    results.push(...partialResults);
    index += 10;
  }

  return results;
}

async function runScrapersSequentially(
  scrapers: ((page: Page, existingKeys: string[]) => Promise<IAssignment[]>)[],
  existingKeys: string[],
  browser: Browser
) {
  const results = [];

  for (const scraper of scrapers) {
    try {
      const value = await runScraper(scraper, existingKeys, browser);
      results.push({ status: "fulfilled", value });
    } catch (error) {
      results.push({ reason: error, status: "rejected", value: [] });
    }
  }

  return results;
}

async function store(assignments: IAssignment[], database: Low<IAssignment[]>): Promise<void> {
  database.data.push(...assignments);
  await database.write();
}
