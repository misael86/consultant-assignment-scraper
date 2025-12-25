import { IAssignment } from "@shared/assignment.js";
import { Page } from "playwright";

import { scrapeOnePage } from "./libs/scrape-one-page.js";

export async function scrapeResursbrist(page: Page, existingKeys: string[]): Promise<IAssignment[]> {
  return scrapeOnePage({
    existingAssignmentIds: existingKeys,
    getAssignmentData: async (element) => {
      const domain = "https://resursbrist.se/";
      const url = domain + (await element.locator("a").getAttribute("href"));
      let id = url.slice(url.lastIndexOf("jobid=") + 6);
      id = id.slice(0, id.indexOf("&"));
      const columns = await element.locator("td").all();
      const title = await columns.at(1)?.textContent();
      return { id, title: title?.trim(), url };
    },
    getElements: async () => {
      await page.waitForSelector(".op-custom-html-block");
      return page.frameLocator("iframe").locator(".jobListContainer").locator(".jobDetailRow").all();
    },
    pageName: "resursbrist",
    pageUrl: "https://resursbrist.se/aktuella-uppdrag/",
    playwrightPage: page,
  });
}
