import { IAssignment } from "@shared/assignment.js";
import { Page } from "playwright";

import { scrapeMultiplePages } from "./libs/scrape-multiple-pages.js";

export async function scrapeVeritaz(page: Page, existingKeys: string[]): Promise<IAssignment[]> {
  return scrapeMultiplePages({
    existingAssignmentIds: existingKeys,
    getAssignmentData: async (element) => {
      const url = await element.getAttribute("href");
      const id = url?.slice(url.lastIndexOf("-") + 1).slice(-1);
      const title = await element.textContent();
      return { id, title: title?.trim(), url };
    },
    getElements: async () => {
      await page.waitForSelector(".group.w-full.border");
      return page.locator(".group.w-full.border").locator("a").all();
    },
    goToNextPage: async () => {
      const button = page.locator("a.next.page-numbers").first();
      if (await button.isVisible()) {
        await button.click();
        await page.waitForTimeout(1000);
      }
    },
    pageName: "veritaz",
    pageUrl: "https://veritaz.se/jobs/",
    playwrightPage: page,
  });
}
