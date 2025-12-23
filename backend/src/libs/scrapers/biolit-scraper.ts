import { IAssignment } from "models/assignment.js";
import { Page } from "playwright";

import { scrapeOnePage } from "./libs/scrape-one-page";

export async function scrapeBiolit(page: Page, existingKeys: string[]): Promise<IAssignment[]> {
  return scrapeOnePage({
    existingAssignmentIds: existingKeys,
    getAssignmentData: async (element) => {
      const url = "https://biolit.se/konsultuppdrag/";
      const id = await element.getAttribute("id");
      const title = await element.locator("b").first().textContent();
      return { id, title: title?.trim(), url };
    },
    getElements: async () => {
      await page.waitForSelector(".collapsible");
      return page.locator(".collapsible").all();
    },
    pageName: "biolit",
    pageUrl: "https://biolit.se/konsultuppdrag/",
    playwrightPage: page,
  });
}
