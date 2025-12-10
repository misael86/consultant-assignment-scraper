import { Page } from "playwright";

import { IAssignment } from "@/lib/scrape-response";

import { scrapeMultiplePages } from "./libs/scrape-multiple-pages";

export async function scrapeProfinder(page: Page, existingKeys: string[]): Promise<IAssignment[]> {
  return scrapeMultiplePages({
    existingAssignmentIds: existingKeys,
    getAssignmentData: async (element) => {
      const url = await element.getAttribute("href");
      const id = url?.slice(url.lastIndexOf("-") + 1);
      const title = await element.textContent();
      return { id, title: title?.trim(), url };
    },
    getElements: async () => {
      await page.waitForSelector(".pro-gallery-margin-container");
      return page.locator(".pro-gallery-margin-container").first().locator("a").all();
    },
    goToNextPage: async () => {
      const element = page.locator('a[aria-label="Next page"]').first();
      if (await element.isVisible()) {
        await element.click();
        await page.waitForTimeout(500);
      }
    },
    pageName: "profinder",
    pageUrl: "https://www.profinder.se/lediga-uppdrag",
    playwrightPage: page,
  });
}
