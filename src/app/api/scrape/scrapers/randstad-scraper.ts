import { Page } from "playwright";

import { IAssignment } from "@/lib/scrape-response";

import { scrapeOnePage } from "./libs/scrape-one-page";

export async function scrapeRandstad(page: Page, existingKeys: string[]): Promise<IAssignment[]> {
  return scrapeOnePage({
    existingAssignmentIds: existingKeys,
    getAssignmentData: async (element) => {
      const domain = "https://www.randstad.se";
      const url = domain + (await element.locator("a").first().getAttribute("href"));
      const id = url?.slice(url.lastIndexOf("_") + 1, -1);
      const title = await element.textContent();
      return { id, title: title?.trim(), url };
    },
    getElements: () => page.locator("#search-results").first().locator("h3").all(),
    pageName: "randstad",
    pageUrl: "https://www.randstad.se/jobb/jt-konsultuppdrag/",
    playwrightPage: page,
    waitForSelector: "#search-results",
  });
}
