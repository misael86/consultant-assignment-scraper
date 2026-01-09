import { IAssignment } from "@shared/assignment";
import { Locator, Page } from "playwright";

interface IProperties {
  existingAssignmentIds: string[];
  getAssignmentData: (
    element: Locator
  ) => Promise<{ id: null | string | undefined; title: string | undefined; url: null | string }>;
  getElements: () => Promise<Locator[]>;
  getMoreAssignmentData?: (
    url: string
  ) => Promise<{ city: string | undefined; lastDate: string | undefined; period: string | undefined }>;
  pageName: string;
  pageUrl: string;
  playwrightPage: Page;
  preScrapeJob?: () => Promise<void>;
}

export async function scrapeOnePage({
  existingAssignmentIds,
  getAssignmentData,
  getElements,
  getMoreAssignmentData,
  pageName,
  pageUrl,
  playwrightPage,
  preScrapeJob,
}: IProperties): Promise<IAssignment[]> {
  console.log("scraping", pageName);

  const assignments: IAssignment[] = [];

  await playwrightPage.goto(pageUrl);

  if (preScrapeJob) await preScrapeJob();
  const elements = await getElements();
  if (elements.length === 0) throw new Error("No elements found for " + pageName);

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

  if (getMoreAssignmentData) {
    for (const assignment of assignments) {
      if (assignment.url === pageUrl) break;
      const { city, lastDate, period } = await getMoreAssignmentData(assignment.url);
      assignment.city = city ?? "N/A";
      assignment.lastDate = lastDate ?? "N/A";
      assignment.period = period ?? "N/A";
    }
  }

  console.log("scraped", pageName, assignments.length);
  return assignments;
}
