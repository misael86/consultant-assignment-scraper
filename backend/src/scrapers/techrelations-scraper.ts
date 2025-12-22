import { Page } from "playwright";

import { IAssignment } from "../types";

import { scrapeOnePage } from "./libs/scrape-one-page";

export async function scrapeTechrelations(page: Page, existingKeys: string[]): Promise<IAssignment[]> {
  return scrapeOnePage({
    existingAssignmentIds: existingKeys,
    getAssignmentData: async (element) => {
      const domain = "https://www.techrelations.se/";
      const url = domain + (await element.getAttribute("href"));
      const title = await element.locator("h3").first().textContent();
      return { id: url, title: title?.trim(), url };
    },
    getElements: async () => {
      await page.waitForSelector('[class*="Assignment_assignments"]');
      return page.locator('[class*="Assignment_assignments"]').first().locator("a").all();
    },
    pageName: "techrelations",
    pageUrl: "https://www.techrelations.se/konsultuppdrag",
    playwrightPage: page,
    preScrapeJob: async () => {
      const button = page.locator('[class*="Assignment_buttonContainer"]').first().locator("button").first();
      let counter = 0;
      while (counter < 10) {
        counter++;
        await button.click();
        await page.waitForTimeout(500);
      }
    },
  });
}
