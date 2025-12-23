import { IAssignment } from "models/assignment.js";
import { Page } from "playwright";

import { scrapeOnePage } from "./libs/scrape-one-page";

export async function scrapeTingent(page: Page, existingKeys: string[]): Promise<IAssignment[]> {
  return scrapeOnePage({
    existingAssignmentIds: existingKeys,
    getAssignmentData: async (element) => {
      const url = "https://tingent.se/jobs";
      const title = await element.textContent();
      return { id: title?.trim(), title: title?.trim(), url };
    },
    getElements: async () => {
      await page.waitForSelector('[class*="JobList__JobListings"]');
      return page.locator('[class*="JobList__JobListings"]').first().locator("h4").all();
    },
    pageName: "tingent",
    pageUrl: "https://tingent.se/jobs",
    playwrightPage: page,
  });
}
