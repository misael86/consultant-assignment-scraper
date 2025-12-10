import { Page } from "playwright";

import { IAssignment } from "@/lib/scrape-response";

import { scrapeOnePage } from "./libs/scrape-one-page";

export async function scrapeASociety(page: Page, existingKeys: string[]): Promise<IAssignment[]> {
  return scrapeOnePage({
    existingAssignmentIds: existingKeys,
    getAssignmentData: async (element) => {
      const domain = "https://www.asocietygroup.com";
      const url = domain + (await element.locator("a").first().getAttribute("href"));
      const id = url.slice(url.lastIndexOf("-") + 1);
      const title = await element.locator('[class*="Assignment_title__"]').textContent();
      return { id, title: title?.trim(), url };
    },
    getElements: async () => {
      await page.waitForSelector('[class*="Assignment_assignmentComponent__"]');
      return page.locator('[class*="Assignment_assignmentComponent__"]').all();
    },
    pageName: "a society",
    pageUrl: "https://www.asocietygroup.com/sv/uppdrag?page=100",
    playwrightPage: page,
  });
}
