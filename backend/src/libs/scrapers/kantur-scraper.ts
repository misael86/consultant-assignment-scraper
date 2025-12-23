import { Page } from "playwright";

import { IAssignment } from "../types";

import { scrapeOnePage } from "./libs/scrape-one-page";

export async function scrapeKantur(page: Page, existingKeys: string[]): Promise<IAssignment[]> {
  return scrapeOnePage({
    existingAssignmentIds: existingKeys,
    getAssignmentData: async (element) => {
      const url = "https://kantur.se/projects";
      const leadKey = await element.getAttribute("data-lead-key");
      const id = leadKey?.slice(url.indexOf("-") + 1);
      const title = await element.textContent();
      return { id, title: title?.trim(), url };
    },
    getElements: async () => {
      await page.waitForSelector(".lead-summary");
      return page.locator(".lead-summary").all();
    },
    pageName: "kantur",
    pageUrl: "https://kantur.se/projects",
    playwrightPage: page,
  });
}
