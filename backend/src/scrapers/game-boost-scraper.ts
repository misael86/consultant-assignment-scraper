import { Page } from "playwright";

import { IAssignment } from "../types";

import { scrapeOnePage } from "./libs/scrape-one-page";

export async function scrapeGameBoost(page: Page, existingKeys: string[]): Promise<IAssignment[]> {
  return scrapeOnePage({
    existingAssignmentIds: existingKeys,
    getAssignmentData: async (element) => {
      const url = await element.getAttribute("href");
      const id = url?.slice(url.lastIndexOf("/") + 1, url.indexOf("-"));
      const title = await element.textContent();
      return { id, title: title?.trim(), url };
    },
    getElements: async () => {
      await page.waitForSelector(".jobs-list-container");
      return page.locator(".jobs-list-container").first().locator("a").all();
    },
    pageName: "game boost",
    pageUrl: "https://www.gameboost.se/jobs",
    playwrightPage: page,
  });
}
