import { Page } from "playwright";

import { IAssignment } from "@/lib/scrape-response";

import { scrapeOnePage } from "./libs/scrape-one-page";

export async function scrapeAliant(page: Page, existingKeys: string[]): Promise<IAssignment[]> {
  return scrapeOnePage({
    existingAssignmentIds: existingKeys,
    getAssignmentData: async (element) => {
      const domain = "https://aliant.recman.se/";
      const onClick = await element.getAttribute("onclick");
      const url = domain + onClick?.replaceAll("'", "").replace("location.href=", "");
      const id = url.slice(url.lastIndexOf("=") + 1);
      const title = await element.locator("span").first().textContent();
      return { id, title: title?.trim(), url };
    },
    getElements: async () => {
      await page.waitForSelector("#job-post-listing-box");
      return page.locator("#job-post-listing-box").first().locator(".box").all();
    },
    pageName: "aliant",
    pageUrl: "https://aliant.recman.se",
    playwrightPage: page,
  });
}
