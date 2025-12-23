import { Page } from "playwright";

import { IAssignment } from "../types";

import { scrapeOnePage } from "./libs/scrape-one-page";

export async function scrapeEpico(page: Page, existingKeys: string[]): Promise<IAssignment[]> {
  return scrapeOnePage({
    existingAssignmentIds: existingKeys,
    getAssignmentData: async (element) => {
      const url = await element.getAttribute("href");
      const id = url?.replace("https://jobs.epico.se/jobs/", "").slice(0, url.lastIndexOf("-"));
      const title = await element.textContent();
      return { id, title: title?.trim(), url };
    },
    getElements: async () => {
      await page.waitForSelector("#jobs_list_container");
      return page.locator("#jobs_list_container").first().locator("a").all();
    },
    pageName: "epico",
    pageUrl: "https://jobs.epico.se/jobs",
    playwrightPage: page,
  });
}
