import { Page } from "playwright";

import { IAssignment } from "@/lib/scrape-response";

import { scrapeOnePage } from "./libs/scrape-one-page";

export async function scrapeGameBoost(page: Page, existingKeys: string[]): Promise<IAssignment[]> {
  return scrapeOnePage({
    existingAssignmentIds: existingKeys,
    getAssignmentData: async (element) => {
      const url = await element.getAttribute("href");
      const id = url?.slice(url.lastIndexOf("/") + 1, url.indexOf("-"));
      const title = await element.textContent();
      return { id, title: title?.trim(), url };
    },
    getElements: () => page.locator(".jobs-list-container").first().locator("a").all(),
    pageName: "game boost",
    pageUrl: "https://www.gameboost.se/jobs",
    playwrightPage: page,
    waitForSelector: ".jobs-list-container",
  });
}
