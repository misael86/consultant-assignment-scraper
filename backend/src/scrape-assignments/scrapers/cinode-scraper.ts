import { IAssignment } from "@shared/assignment.js";
import { Page } from "playwright";

import { scrapeMultiplePages } from "./libs/scrape-multiple-pages.js";

export async function scrapeCinode(page: Page, existingKeys: string[]): Promise<IAssignment[]> {
  return scrapeMultiplePages({
    existingAssignmentIds: existingKeys,
    getAssignmentData: async (element) => {
      const domain = "https://cinode.market";
      const url = domain + (await element.locator("a").first().getAttribute("href"));
      const id = url.slice(url.lastIndexOf("/") + 1);
      const title = await element.locator("a").textContent();
      return { id, title: title?.trim(), url };
    },
    getElements: async () => {
      await page.waitForSelector("app-list-row");
      return page.locator("app-list-row").all();
    },
    goToNextPage: () => page.getByRole("button", { name: /Next page/i }).click(),
    pageName: "cinode",
    pageUrl: "https://cinode.market/requests",
    playwrightPage: page,
    preScrapeJob: () => page.getByRole("button", { name: /Reject/i }).click(),
  });
}
