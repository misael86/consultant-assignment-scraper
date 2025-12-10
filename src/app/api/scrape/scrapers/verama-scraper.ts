import { Page } from "playwright";

import { IAssignment } from "@/lib/scrape-response";

import { scrapeOnePage } from "./libs/scrape-one-page";

export async function scrapeVerama(page: Page, existingKeys: string[]): Promise<IAssignment[]> {
  return scrapeOnePage({
    existingAssignmentIds: existingKeys,
    getAssignmentData: async (element) => {
      const domain = "https://app.verama.com";
      const url = domain + (await element.getAttribute("href"));
      const id = url.slice(url.lastIndexOf("/") + 1);
      const title = await element.locator(".el-header").first().textContent();
      return { id, title: title?.trim(), url };
    },
    getElements: async () => {
      await page.waitForSelector("a.route-section");
      return page.locator("a.route-section").all();
    },
    pageName: "verama",
    pageUrl: "https://app.verama.com/app/job-requests?size=500",
    playwrightPage: page,
  });
}
