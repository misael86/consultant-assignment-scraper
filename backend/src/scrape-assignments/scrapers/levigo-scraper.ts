import { IAssignment } from "@shared/assignment.js";
import { Page } from "playwright";

import { scrapeOnePage } from "./libs/scrape-one-page.js";

export async function scrapeLevigo(page: Page, existingKeys: string[]): Promise<IAssignment[]> {
  return scrapeOnePage({
    existingAssignmentIds: existingKeys,
    getAssignmentData: async (element) => {
      const url = await element.getAttribute("href");
      let id = url?.slice(0, url.lastIndexOf("/"));
      id = id?.slice(id.lastIndexOf("/") + 1);
      const title = await element.textContent();
      return { id, title: title?.trim(), url };
    },
    getElements: async () => {
      await page.waitForSelector(".elementor-shortcode");
      return page.locator(".elementor-shortcode").first().locator("a").all();
    },
    pageName: "levigo",
    pageUrl: "https://levigo.se/assignments/",
    playwrightPage: page,
  });
}
