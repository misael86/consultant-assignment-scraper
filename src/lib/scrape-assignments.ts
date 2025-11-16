import { JSONFilePreset } from "lowdb/node";

import filters from "@/context/filters.json";

import { IAssignment } from "./scrape-response";
import { scrapeASociety } from "./scrapers/a-society-scraper";
import { scrapeAliant } from "./scrapers/aliant-scraper";
import { scrapeBiolit } from "./scrapers/biolit-scraper";
import { scrapeCinode } from "./scrapers/cinode-scraper";
import { scrapeVerama } from "./scrapers/verama-scraper";

export async function scrapeAssignments() {
  const aSocietyAssignments = await scrapeASociety();
  const aliantAssignments = await scrapeAliant();
  const biolitAssignments = await scrapeBiolit();
  const cinodeAssignments = await scrapeCinode();
  const veramaAssignments = await scrapeVerama();

  let assignments = await store([
    ...aSocietyAssignments,
    ...aliantAssignments,
    ...biolitAssignments,
    ...cinodeAssignments,
    ...veramaAssignments,
  ]);

  assignments = sort(assignments);
  assignments = tag(assignments);

  return assignments;
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

async function store(assignments: IAssignment[]): Promise<IAssignment[]> {
  const database = await JSONFilePreset<IAssignment[]>("./src/context/assignments.json", assignments);
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
