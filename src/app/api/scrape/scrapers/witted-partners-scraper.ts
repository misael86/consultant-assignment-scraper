import { Page } from "playwright";

import { IAssignment } from "@/lib/scrape-response";

import { scrapeOnePage } from "./libs/scrape-one-page";

export async function scrapeWittedPartners(page: Page, existingKeys: string[]): Promise<IAssignment[]> {
  return scrapeOnePage({
    existingAssignmentIds: existingKeys,
    getAssignmentData: async (element) => {
      const url = await element.getAttribute("href");
      const id = url?.slice(0, url.indexOf("-")).slice(url.lastIndexOf("/") + 1);
      const title = await element.locator("h2").first().textContent();
      return { id, title: title?.trim(), url };
    },
    getElements: () => page.locator("ul.wrapper").first().locator("a").all(),
    pageName: "witted partners",
    pageUrl: "https://wittedpartners.com/projects",
    playwrightPage: page,
    waitForSelector: "ul.wrapper",
  });
}
