import { IAssignment } from "models/assignment.js";
import { Page } from "playwright";

import { scrapeOnePage } from "./libs/scrape-one-page";

export async function scrapeRandstad(page: Page, existingKeys: string[]): Promise<IAssignment[]> {
  return scrapeOnePage({
    existingAssignmentIds: existingKeys,
    getAssignmentData: async (element) => {
      const domain = "https://www.randstad.se";
      const url = domain + (await element.locator("a").first().getAttribute("href"));
      const id = url?.slice(url.lastIndexOf("_") + 1, -1);
      const title = await element.textContent();
      return { id, title: title?.trim(), url };
    },
    getElements: async () => {
      await page.waitForSelector("#search-results");
      return page.locator("#search-results").first().locator("h3").all();
    },
    pageName: "randstad",
    pageUrl: "https://www.randstad.se/jobb/jt-konsultuppdrag/",
    playwrightPage: page,
  });
}
