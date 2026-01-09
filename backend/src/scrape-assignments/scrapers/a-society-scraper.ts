import { IAssignment } from "@shared/assignment.js";
import { Page } from "playwright";

import { scrapeOnePage } from "./libs/scrape-one-page.js";

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
    getMoreAssignmentData: async (url: string) => {
      await page.goto(url);
      await page.waitForSelector('[class*="AssignmentContent_keyPoints__"]');
      const keyPoints = await page
        .locator('[class*="AssignmentContent_keyPoints__"]')
        .locator('[class*="AssignmentContent_point__"]')
        .all();

      let city;
      let period;
      let lastDate;

      for (const keyPoint of keyPoints) {
        const text = await keyPoint.textContent();
        if (text?.includes("Arbetsort")) {
          city = text?.replace("Arbetsort", "").trim();
        } else if (text?.includes("Period")) {
          period = text?.replace("Period", "").trim();
        } else if (text?.includes("Sista ansökningsdag")) {
          lastDate = text?.replace("Sista ansökningsdag", "").trim();
        }
      }

      return { city, lastDate, period };
    },
    pageName: "a society",
    pageUrl: "https://www.asocietygroup.com/sv/uppdrag?page=100",
    playwrightPage: page,
  });
}
