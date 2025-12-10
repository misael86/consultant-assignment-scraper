import { Page } from "playwright";

import { IAssignment } from "@/lib/scrape-response";

import { scrapeOnePage } from "./libs/scrape-one-page";

export async function scrapeHouseOfSkills(page: Page, existingKeys: string[]): Promise<IAssignment[]> {
  return scrapeOnePage({
    existingAssignmentIds: existingKeys,
    getAssignmentData: async (element) => {
      const idString = await element.getAttribute("id");
      const anchorElement = element.locator("a").first();
      const url = await anchorElement.getAttribute("href");
      const id = idString?.slice(idString.indexOf("-") + 1);
      const title = await anchorElement.textContent();
      return { id, title: title?.trim(), url };
    },
    getElements: async () => {
      await page.waitForSelector(".et_pb_posts");
      return page.locator(".et_pb_posts").first().locator("article").all();
    },
    pageName: "house of skills",
    pageUrl: "https://houseofskills.se/konsultuppdrag/",
    playwrightPage: page,
  });
}
