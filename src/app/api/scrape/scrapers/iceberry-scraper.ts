import { Page } from "playwright";

import { IAssignment } from "@/lib/scrape-response";

import { scrapeOnePage } from "./libs/scrape-one-page";

export async function scrapeIceberry(page: Page, existingKeys: string[]): Promise<IAssignment[]> {
  return scrapeOnePage({
    existingAssignmentIds: existingKeys,
    getAssignmentData: async (element) => {
      const url = "https://uppdrag.iceberry.se/";
      const title = await element.locator(".header").first().textContent();
      return { id: title, title: title?.trim(), url };
    },
    getElements: async () => {
      await page.waitForSelector(".flow-card-container");
      return page.locator(".flow-card-container").all();
    },
    pageName: "iceberry",
    pageUrl: "https://uppdrag.iceberry.se/",
    playwrightPage: page,
  });
}
