import { IAssignment } from "models/assignment.js";
import { Page } from "playwright";

import { scrapeOnePage } from "./libs/scrape-one-page";

export async function scrapeRegent(page: Page, existingKeys: string[]): Promise<IAssignment[]> {
  return scrapeOnePage({
    existingAssignmentIds: existingKeys,
    getAssignmentData: async (element) => {
      const domain = "https://regent.se";
      const url = domain + (await element.locator("a").first().getAttribute("href"));
      const id = url?.slice(url.lastIndexOf("/") + 1);
      const title = await element.locator("a").first().textContent();
      return { id, title: title?.trim(), url };
    },
    getElements: async () => {
      await page.waitForSelector(".assignments");
      return page.locator(".assignments").first().locator(".assignment-item").all();
    },
    pageName: "regent",
    pageUrl: "https://regent.se/uppdrag/",
    playwrightPage: page,
  });
}
