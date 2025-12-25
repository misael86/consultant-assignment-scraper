import { IAssignment } from "@shared/assignment.js";
import { Page } from "playwright";

import { scrapeOnePage } from "./libs/scrape-one-page.js";

export async function scrapeTogetherTech(page: Page, existingKeys: string[]): Promise<IAssignment[]> {
  return scrapeOnePage({
    existingAssignmentIds: existingKeys,
    getAssignmentData: async (element) => {
      const url = await element.getAttribute("href");
      const id = url?.slice(0, url.indexOf("-")).slice(url.lastIndexOf("/") + 1);
      const title = await element.textContent();
      return { id, title: title?.trim(), url };
    },
    getElements: async () => {
      await page.waitForSelector(".beta-content-list");
      return page.locator(".beta-content-list").first().locator("a").all();
    },
    pageName: "together tech",
    pageUrl: "https://www.togethertech.com/sv/lediga-jobb",
    playwrightPage: page,
  });
}
