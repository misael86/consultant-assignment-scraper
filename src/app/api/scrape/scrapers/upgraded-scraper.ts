import { Page } from "playwright";

import { IAssignment } from "@/lib/scrape-response";

import { scrapeOnePage } from "./libs/scrape-one-page";

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
    getElements: () => page.locator(".konsultuppdrag-table").first().locator("a").all(),
    pageName: "upgraded",
    pageUrl: "https://upgraded.se/lediga-uppdrag/",
    playwrightPage: page,
    waitForSelector: ".konsultuppdrag-table",
  });
}
