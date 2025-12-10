import { Page } from "playwright";

import { IAssignment } from "@/lib/scrape-response";

import { scrapeOnePage } from "./libs/scrape-one-page";

export async function scrapeSafemind(page: Page, existingKeys: string[]): Promise<IAssignment[]> {
  return scrapeOnePage({
    existingAssignmentIds: existingKeys,
    getAssignmentData: async (element) => {
      const url = await element.locator("a").first().getAttribute("href");
      let id = url?.slice(0, -1);
      id = id?.slice(id.lastIndexOf("/") + 1);
      id = id?.slice(0, id.indexOf("-"));
      const title = await element.locator("a").first().textContent();
      return { id, title: title?.trim(), url };
    },
    getElements: async () => {
      await page.waitForSelector("#jobs-output");
      return page.locator("#jobs-output").first().locator(".job__content").all();
    },
    pageName: "safemind",
    pageUrl: "https://www.safemind.se/lediga-jobb-tjanster/?tmp=1",
    playwrightPage: page,
  });
}
