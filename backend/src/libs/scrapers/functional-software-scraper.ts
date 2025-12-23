import { IAssignment } from "models/assignment.js";
import { Page } from "playwright";

import { scrapeOnePage } from "./libs/scrape-one-page";

export async function scrapeFunctionalSoftware(page: Page, existingKeys: string[]): Promise<IAssignment[]> {
  return scrapeOnePage({
    existingAssignmentIds: existingKeys,
    getAssignmentData: async (element) => {
      const domain = "https://functionalsoftware.se";
      const url = domain + (await element.getAttribute("href"));
      const id = url?.slice(url.lastIndexOf("/") + 1);
      const title = await element.textContent();
      return { id, title: title?.trim(), url };
    },
    getElements: async () => {
      await page.waitForSelector(".list-unstyled");
      return page.locator(".list-unstyled").first().locator("a").all();
    },
    pageName: "functional software",
    pageUrl: "https://functionalsoftware.se/jobs/",
    playwrightPage: page,
  });
}
