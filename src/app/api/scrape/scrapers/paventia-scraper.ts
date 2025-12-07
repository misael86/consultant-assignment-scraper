import { Page } from "playwright";

import { IAssignment } from "@/lib/scrape-response";

import { scrapeOnePage } from "./libs/scrape-one-page";

export async function scrapePaventia(page: Page, existingKeys: string[]): Promise<IAssignment[]> {
  return scrapeOnePage({
    existingAssignmentIds: existingKeys,
    getAssignmentData: async (element) => {
      const url = await element.getAttribute("href");
      let id = url?.slice(0, url.lastIndexOf("/"));
      id = id?.slice(id.lastIndexOf("/") + 1);
      const title = await element.textContent();
      return { id, title: title?.trim(), url };
    },
    getElements: () => page.locator(".cw-joblisting-results").first().locator(".posR").first().locator("a").all(),
    pageName: "paventia",
    pageUrl: "https://jobs.paventia.se/jobs/open",
    playwrightPage: page,
    waitForSelector: ".cw-joblisting-results",
  });
}
