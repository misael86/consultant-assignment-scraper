import { IAssignment } from "@shared/assignment.js";
import { Page } from "playwright";

import { scrapeOnePage } from "./libs/scrape-one-page.js";

export async function scrapeUpgraded(page: Page, existingKeys: string[]): Promise<IAssignment[]> {
  return scrapeOnePage({
    existingAssignmentIds: existingKeys,
    getAssignmentData: async (element) => {
      const url = await element.getAttribute("href");
      let id = url?.slice(0, url.indexOf("-"));
      id = id?.slice(id.lastIndexOf("/") + 1);
      const title = await element.textContent();
      return { id, title: title?.trim(), url };
    },
    getElements: async () => {
      await page.waitForSelector(".konsultuppdrag-table");
      return page.locator(".konsultuppdrag-table").first().locator("a").all();
    },
    pageName: "upgraded",
    pageUrl: "https://upgraded.se/lediga-uppdrag/",
    playwrightPage: page,
  });
}
