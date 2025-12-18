import { Locator, Page } from "playwright";

import { IAssignment } from "@/lib/scrape-response";

interface IProperties {
  existingAssignmentIds: string[];
  getAssignmentData: (
    element: Locator
  ) => Promise<{ id: null | string | undefined; title: string | undefined; url: null | string }>;
  getElements: () => Promise<Locator[]>;
  goToNextPage: () => Promise<void>;
  pageName: string;
  pageUrl: string;
  playwrightPage: Page;
  preScrapeJob?: (page: Page) => Promise<void>;
}

export async function scrapeMultiplePages({
  existingAssignmentIds,
  getAssignmentData,
  getElements,
  goToNextPage,
  pageName,
  pageUrl,
  playwrightPage,
  preScrapeJob,
}: IProperties): Promise<IAssignment[]> {
  console.log("scraping", pageName);

  const assignments: IAssignment[] = [];

  await playwrightPage.goto(pageUrl);
  if (preScrapeJob) await preScrapeJob(playwrightPage);

  const assignmentIds = [...existingAssignmentIds];
  let continueScraping = true;
  while (continueScraping) {
    const elements = await getElements();
    if (elements.length === 0) throw new Error("No elements found for " + pageName);

    if (elements.length === 0) {
      continueScraping = false;
      continue;
    }

    for (const element of elements) {
      const { id, title, url } = await getAssignmentData(element);

      if (assignmentIds.includes(`${pageName}-${id}`)) {
        continueScraping = false;
        break;
      }

      const scraped = new Date().toLocaleDateString("sv-SE");
      assignments.push({ id: id ?? "", scraped, source: pageName, title: title?.trim(), url: url ?? "" });
      assignmentIds.push(`${pageName}-${id}`);
    }

    if (continueScraping) await goToNextPage();
  }

  console.log("scraped", pageName, assignments.length);
  return assignments;
}
