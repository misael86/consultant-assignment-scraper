import { IAssignment } from "models/assignment.js";
import { Page } from "playwright";

import { scrapeOnePage } from "./libs/scrape-one-page";

export async function scrapeSeequaly(page: Page, existingKeys: string[]): Promise<IAssignment[]> {
  return scrapeOnePage({
    existingAssignmentIds: existingKeys,
    getAssignmentData: async (element) => {
      const url = await element.getAttribute("href");
      const id = url?.slice(url.lastIndexOf("/") + 1);
      const title = await element.textContent();
      return { id, title: title?.trim(), url };
    },
    getElements: async () => {
      return page
        .frameLocator('iframe[src="https://www.careers-page.com/seequaly"]')
        .locator("ul.list-unstyled")
        .first()
        .locator("a")
        .all();
    },
    pageName: "seequaly",
    pageUrl: "https://seequaly.com/uppdrag/",
    playwrightPage: page,
  });
}
