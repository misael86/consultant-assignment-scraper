import { IAssignment } from "@shared/assignment.js";
import { Page } from "playwright";

import { scrapeOnePage } from "./libs/scrape-one-page.js";

export async function scrapeKeyman(page: Page, existingKeys: string[]): Promise<IAssignment[]> {
  return scrapeOnePage({
    existingAssignmentIds: existingKeys,
    getAssignmentData: async (element) => {
      const url = await element.getAttribute("href");
      const id = url;
      const title = await element.textContent();
      return { id, title: title?.trim(), url };
    },
    getElements: async () => {
      await page.waitForSelector(".elementor-loop-container");
      return page.locator(".elementor-loop-container").first().locator("a").all();
    },
    pageName: "keyman",
    pageUrl: "https://www.keyman.se/sv/uppdrag/",
    playwrightPage: page,
    // preScrapeJob: async () => {
    //   await page.getByRole("button", { name: /Visa fler/i }).click();
    // },
  });
}
