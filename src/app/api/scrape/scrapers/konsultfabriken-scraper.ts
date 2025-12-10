import { Page } from "playwright";

import { IAssignment } from "@/lib/scrape-response";

import { scrapeOnePage } from "./libs/scrape-one-page";

export async function scrapeKonsultfabriken(page: Page, existingKeys: string[]): Promise<IAssignment[]> {
  return scrapeOnePage({
    existingAssignmentIds: existingKeys,
    getAssignmentData: async (element) => {
      const url = await element.getAttribute("href");
      const id = url?.slice(url.indexOf("="));
      const title = await element.textContent();
      return { id, title: title?.trim(), url };
    },
    getElements: async () => {
      await page.waitForSelector("#jobs");
      return page.locator("#jobs").first().locator("a").all();
    },
    pageName: "konsultfabriken",
    pageUrl: "https://konsultfabriken.se/all-assignments.php",
    playwrightPage: page,
  });
}
