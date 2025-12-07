import { Page } from "playwright";

import { IAssignment } from "@/lib/scrape-response";

import { scrapeOnePage } from "./libs/scrape-one-page";

export async function scrapeSenterprise(page: Page, existingKeys: string[]): Promise<IAssignment[]> {
  return scrapeOnePage({
    existingAssignmentIds: existingKeys,
    getAssignmentData: async (element) => {
      const url = await element.getAttribute("href");
      const id = url?.slice(0, url.indexOf("-")).slice(url.lastIndexOf("/") + 1);
      const title = await element.textContent();
      return { id, title: title?.trim(), url };
    },
    getElements: () => page.locator("#jobs_list_container").first().locator("a").all(),
    pageName: "senterprise",
    pageUrl: "https://jobb.senterprise.se/jobs?department_id=6559",
    playwrightPage: page,
    waitForSelector: "#jobs_list_container",
  });
}
