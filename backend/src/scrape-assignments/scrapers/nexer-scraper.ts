import { IAssignment } from "@shared/assignment.js";
import { Page } from "playwright";

import { scrapeOnePage } from "./libs/scrape-one-page.js";

export async function scrapeNexer(page: Page, existingKeys: string[]): Promise<IAssignment[]> {
  return scrapeOnePage({
    existingAssignmentIds: existingKeys,
    getAssignmentData: async (element) => {
      const domain = "https://nexergroup.com/career/open-positions/";
      const url = domain + (await element.getAttribute("href"));
      const id = url.replace("/", "");
      const title = await element.locator("h2").first().textContent();
      return { id, title: title?.trim(), url };
    },
    getElements: async () => {
      await page.waitForSelector(".nexer-all-jobs-wrapper");
      return page.locator(".nexer-all-jobs-wrapper").first().locator("a").all();
    },
    pageName: "nexer",
    pageUrl: "https://nexergroup.com/career/open-positions/",
    playwrightPage: page,
    preScrapeJob: async () => {
      const loadMoreButton = page.locator("button.arrow-link").first();
      while (await loadMoreButton.isVisible()) {
        await loadMoreButton.click();
      }
    },
  });
}
