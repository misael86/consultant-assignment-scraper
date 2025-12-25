import { IAssignment } from "@shared/assignment.js";
import { Page } from "playwright";

import { scrapeOnePage } from "./libs/scrape-one-page.js";

export async function scrapeKoalitionen(page: Page, existingKeys: string[]): Promise<IAssignment[]> {
  return scrapeOnePage({
    existingAssignmentIds: existingKeys,
    getAssignmentData: async (element) => {
      const url = await element.getAttribute("href");
      const id = url?.slice(0, url.indexOf("-")).slice(url.lastIndexOf("/") + 1);
      const title = await element.locator("h3").textContent();
      return { id, title: title?.trim(), url };
    },
    getElements: async () => {
      await page.waitForSelector("#career-list");
      return page.locator("#career-list").first().locator("a").all();
    },
    pageName: "koalitionen",
    pageUrl: "https://koalitionen.com/career/",
    playwrightPage: page,
  });
}
