import { Page } from "playwright";

import { IAssignment } from "../types";

import { scrapeOnePage } from "./libs/scrape-one-page";

export async function scrapeWiseIT(page: Page, existingKeys: string[]): Promise<IAssignment[]> {
  return scrapeOnePage({
    existingAssignmentIds: existingKeys,
    getAssignmentData: async (element) => {
      const url = await element.getAttribute("href");
      const id = url?.slice(url.lastIndexOf("-") + 1);
      const title = await element.textContent();
      return { id, title: title?.trim(), url };
    },
    getElements: async () => {
      await page.waitForSelector(".archive-item.job");
      return page.locator(".archive-item.job").locator("a").all();
    },
    pageName: "wise it",
    pageUrl: "https://www.wise.se/specialistomraden/it/lediga-jobb/?jobCats=it&jobTags=konsult",
    playwrightPage: page,
  });
}
