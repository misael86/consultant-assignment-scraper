import { Page } from "playwright";

import { IAssignment } from "@/lib/scrape-response";

import { scrapeMultiplePages } from "./libs/scrape-multiple-pages";

export async function scrapeTeksystems(page: Page, existingKeys: string[]): Promise<IAssignment[]> {
  return scrapeMultiplePages({
    existingAssignmentIds: existingKeys,
    getAssignmentData: async (element) => {
      const url = await element.locator("a").first().getAttribute("href");
      let id = url?.slice(0, url.lastIndexOf("/"));
      id = id?.slice(id.lastIndexOf("-") + 1);
      const title = await element.locator("a").first().textContent();
      return { id, title: title?.trim(), url };
    },
    getElements: () => page.locator(".jobs-list-item").all(),
    goToNextPage: async () => {
      const button = page.locator("span.icon-arrow-right").first();
      if (await button.isVisible()) {
        await button.click();
        await page.waitForTimeout(1000);
      }
    },
    pageName: "teksystems",
    pageUrl: "https://careers.teksystems.com/gb/en/c/developer-jobs",
    playwrightPage: page,
    waitForSelector: `.jobs-list-item`,
  });
}
