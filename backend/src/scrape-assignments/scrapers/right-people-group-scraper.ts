import { IAssignment } from "@shared/assignment.js";
import { Page } from "playwright";

import { scrapeOnePage } from "./libs/scrape-one-page.js";

export async function scrapeRightPeopleGroup(page: Page, existingKeys: string[]): Promise<IAssignment[]> {
  return scrapeOnePage({
    existingAssignmentIds: existingKeys,
    getAssignmentData: async (element) => {
      const domain = "https://rightpeoplegroup.com";
      const url = domain + (await element.getAttribute("href"));
      const title = await element.textContent();
      return { id: url, title: title?.trim(), url };
    },
    getElements: async () => {
      await page.waitForSelector(".mantine-Container-root");
      return page.locator(".mantine-Container-root > a").all();
    },
    pageName: "right people group",
    pageUrl: "https://rightpeoplegroup.com/sv/open-assignments",
    playwrightPage: page,
  });
}
