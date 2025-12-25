import { IAssignment } from "@shared/assignment.js";
import { Page } from "playwright";

import { scrapeOnePage } from "./libs/scrape-one-page.js";

export async function scrapeGreateIT(page: Page, existingKeys: string[]): Promise<IAssignment[]> {
  return scrapeOnePage({
    existingAssignmentIds: existingKeys,
    getAssignmentData: async (element) => {
      const url = await element.getAttribute("href");
      const id = url?.slice(url.lastIndexOf("/") + 1, url.indexOf("-"));
      const title = await element.textContent();
      return { id, title: title?.trim(), url };
    },
    getElements: async () => {
      await page.waitForSelector("#jobs_list_container");
      return page.locator("#jobs_list_container").first().locator("a").all();
    },
    pageName: "great it",
    pageUrl: "https://jobb.greatit.se/jobs",
    playwrightPage: page,
  });
}
