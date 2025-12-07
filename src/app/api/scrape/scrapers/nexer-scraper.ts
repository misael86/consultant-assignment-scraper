import { Page } from "playwright";

import { IAssignment } from "@/lib/scrape-response";

import { scrapeOnePage } from "./libs/scrape-one-page";

export async function scrapeNexer(page: Page, existingKeys: string[]): Promise<IAssignment[]> {
  return scrapeOnePage({
    existingAssignmentIds: existingKeys,
    getAssignmentData: async (element) => {
      const domain = "https://nexergroup.com/career/open-positions/";
      const url = domain + (await element.getAttribute("href"));
      const id = url.replace("/", "");
      const title = await element.locator("h2").first().textContent();
      return { id, title: title?.trim(), url };
    },
    getElements: () => page.locator(".nexer-all-jobs-wrapper").first().locator("a").all(),
    pageName: "nexer",
    pageUrl: "https://nexergroup.com/career/open-positions/",
    playwrightPage: page,
    preScrapeJob: async () => {
      const loadMoreButton = page.locator("button.arrow-link").first();
      while (await loadMoreButton.isVisible()) {
        await loadMoreButton.click();
      }
    },
    waitForSelector: ".nexer-all-jobs-wrapper",
  });
}
