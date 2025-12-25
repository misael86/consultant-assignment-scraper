import { IAssignment } from "@shared/assignment.js";
import { Page } from "playwright";

import { scrapeOnePage } from "./libs/scrape-one-page.js";

export async function scrapeAmendo(page: Page, existingKeys: string[]): Promise<IAssignment[]> {
  return scrapeOnePage({
    existingAssignmentIds: existingKeys,
    getAssignmentData: async (element) => {
      const url = await element.getAttribute("href");
      const id = url?.slice(0, url.indexOf("-")).slice(url.lastIndexOf("/") + 1);
      const title = await element.locator("span.text-block-base-link").textContent();
      return { id, title: title?.trim(), url };
    },
    getElements: async () => {
      await page.waitForSelector(".z-career-jobs-list");
      return page.locator(".z-career-jobs-list").first().locator("a").all();
    },
    pageName: "amendo",
    pageUrl: "https://jobb.amendo.se/jobs",
    playwrightPage: page,
  });
}
