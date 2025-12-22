import { Page } from "playwright";

import { IAssignment } from "../types";

import { scrapeOnePage } from "./libs/scrape-one-page";

export async function scrapeItcNetwork(page: Page, existingKeys: string[]): Promise<IAssignment[]> {
  return scrapeOnePage({
    existingAssignmentIds: existingKeys,
    getAssignmentData: async (element) => {
      const url = "https://itc.inkopio.se/vms/Login";
      const title = await element.locator("h3").textContent();
      return { id: title, title: title?.trim(), url };
    },
    getElements: async () => {
      await page.waitForSelector(".maf_feed_parent");
      return page.locator(".maf_feed_single").all();
    },
    pageName: "itc network",
    pageUrl: "https://itcnetwork.se/uppdrag/",
    playwrightPage: page,
  });
}
