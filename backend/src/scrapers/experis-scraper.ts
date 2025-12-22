import { Page } from "playwright";

import { IAssignment } from "../types";

import { scrapeOnePage } from "./libs/scrape-one-page";

export async function scrapeExperis(page: Page, existingKeys: string[]): Promise<IAssignment[]> {
  return scrapeOnePage({
    existingAssignmentIds: existingKeys,
    getAssignmentData: async (element) => {
      const domain = "https://www.experis.se";
      const url = domain + (await element.locator("a").first().getAttribute("href"));
      const id = url?.replace("/sv/jobb/", "").slice(0, url.lastIndexOf("/"));
      const title = await element.textContent();
      return { id, title: title?.trim(), url };
    },
    getElements: async () => {
      await page.waitForSelector(".job-position");
      return page.locator(".job-position").all();
    },
    pageName: "experis",
    pageUrl: "https://www.experis.se/sv/sok",
    playwrightPage: page,
    // preScrapeJob: () => page.getByRole("button", { name: /Avvisa alla/i }).click(),
  });
}
