import { Locator, Page } from "playwright";

import { IAssignment } from "@/lib/scrape-response";

interface IProperties {
  existingAssignmentIds: string[];
  getAssignmentData: (
    element: Locator
  ) => Promise<{ id: null | string | undefined; title: string | undefined; url: null | string }>;
  getElements: () => Promise<Locator[]>;
  pageName: string;
  pageUrl: string;
  playwrightPage: Page;
  preScrapeJob?: () => Promise<void>;
  waitForSelector: string;
}

export async function scrapeOnePage({
  existingAssignmentIds,
  getAssignmentData,
  getElements,
  pageName,
  pageUrl,
  playwrightPage,
  preScrapeJob,
  waitForSelector,
}: IProperties): Promise<IAssignment[]> {
  console.log("scraping", pageName);

  await playwrightPage.goto(pageUrl);
  await playwrightPage.waitForSelector(waitForSelector);
  if (preScrapeJob) await preScrapeJob();

  const elements = await getElements();
  if (elements.length === 0) throw new Error("No elements found for " + pageName);

  const assignments: IAssignment[] = [];
  for (const element of elements) {
    const { id, title, url } = await getAssignmentData(element);
    if (existingAssignmentIds.includes(`${pageName}-${id}`)) break;
    assignments.push({
      id: id ?? "",
      scraped: new Date().toLocaleDateString("sv-SE"),
      source: pageName,
      title: title,
      url: url ?? pageUrl,
    });
  }

  console.log("scraped", pageName, assignments.length);
  return assignments;
}
