import { IAssignment } from "models/assignment.js";
import { Page } from "playwright";

import { scrapeOnePage } from "./libs/scrape-one-page";

export async function scrapeSigma(page: Page, existingKeys: string[]): Promise<IAssignment[]> {
  return scrapeOnePage({
    existingAssignmentIds: existingKeys,
    getAssignmentData: async (element) => {
      const domain = "https://www.sigma.se";
      const url = domain + (await element.getAttribute("href"));
      const title = await element.locator("h4").first().textContent();
      return { id: url, title: title?.trim(), url };
    },
    getElements: async () => {
      await page.waitForSelector("#vm_jobs");
      return page.locator("#vm_jobs").first().locator("ul").first().locator("a").all();
    },
    pageName: "sigma",
    pageUrl: "https://www.sigma.se/sv/karriar/partner-uppdrag/",
    playwrightPage: page,
    preScrapeJob: async () => {
      await page.waitForSelector("a.item--more");
      const loadMoreButton = page.locator("a.item--more").first();
      while (await loadMoreButton.isVisible()) {
        await loadMoreButton.click();
        await page.waitForTimeout(500);
      }
    },
  });
}
