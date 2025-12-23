import { IAssignment } from "models/assignment.js";
import { Page } from "playwright";

import { scrapeMultiplePages } from "./libs/scrape-multiple-pages";

export async function scrapeNikita(page: Page, existingKeys: string[]): Promise<IAssignment[]> {
  return scrapeMultiplePages({
    existingAssignmentIds: existingKeys,
    getAssignmentData: async (element) => {
      const url = await element.locator("a").first().getAttribute("href");
      const title = await element.locator(".open-position-title").first().textContent();
      return { id: url, title: title?.trim(), url };
    },
    getElements: async () => {
      await page.waitForSelector(".open-position-list");
      return page.locator(".open-position-item.opened").all();
    },
    goToNextPage: async () => {
      const element = page.locator(".nextpostslink");
      if (await element.isVisible()) {
        await element.click();
        await page.waitForTimeout(500);
      }
    },
    pageName: "nikita",
    pageUrl: "https://www.nikita.se/lediga-uppdrag/",
    playwrightPage: page,
  });
}
