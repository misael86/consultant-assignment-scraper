import { Page } from "playwright";

import { IAssignment } from "../types";

import { scrapeMultiplePages } from "./libs/scrape-multiple-pages";

export async function scrapeJappa(page: Page, existingKeys: string[]): Promise<IAssignment[]> {
  return scrapeMultiplePages({
    existingAssignmentIds: existingKeys,
    getAssignmentData: async (element) => {
      const domain = "https://www.jappa.jobs/";
      const url = domain + (await element.getAttribute("href"));
      const id = url.slice(0, url.indexOf("-")).slice(url.lastIndexOf("/") + 1);
      const title = await element.locator(".job-title").textContent();
      return { id, title: title?.trim(), url };
    },
    getElements: async () => {
      await page.waitForSelector("a.job-item");
      return page.locator("a.job-item").all();
    },
    goToNextPage: async () => {
      const nextButton = page.locator(`button[aria-label="Nästa sida"]`);
      if (await nextButton.isEnabled()) {
        await page.waitForTimeout(500);
        await nextButton.focus();
        await nextButton.click();
        await page.waitForTimeout(500);
      }
    },
    pageName: "jappa",
    pageUrl: "https://www.jappa.jobs/jobb",
    playwrightPage: page,
  });
}
