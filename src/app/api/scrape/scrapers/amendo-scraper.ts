import { Page } from "playwright";

import { IAssignment } from "@/lib/scrape-response";

import { scrapeOnePage } from "./libs/scrape-one-page";

export async function scrapeAmendo(page: Page, existingKeys: string[]): Promise<IAssignment[]> {
  return scrapeOnePage({
    existingAssignmentIds: existingKeys,
    getAssignmentData: async (element) => {
      const url = await element.getAttribute("href");
      const id = url?.slice(0, url.indexOf("-")).slice(url.lastIndexOf("/") + 1);
      const title = await element.locator("span.text-block-base-link").textContent();
      return { id, title: title?.trim(), url };
    },
    getElements: () => page.locator(".z-career-jobs-list").first().locator("a").all(),
    pageName: "amendo",
    pageUrl: "https://jobb.amendo.se/jobs",
    playwrightPage: page,
    waitForSelector: ".z-career-jobs-list",
  });
}
