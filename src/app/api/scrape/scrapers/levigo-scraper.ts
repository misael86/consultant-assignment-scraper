import { Page } from "playwright";

import { IAssignment } from "@/lib/scrape-response";

import { scrapeOnePage } from "./libs/scrape-one-page";

export async function scrapeLevigo(page: Page, existingKeys: string[]): Promise<IAssignment[]> {
  return scrapeOnePage({
    existingAssignmentIds: existingKeys,
    getAssignmentData: async (element) => {
      const url = await element.getAttribute("href");
      let id = url?.slice(0, url.lastIndexOf("/"));
      id = id?.slice(id.lastIndexOf("/") + 1);
      const title = await element.textContent();
      return { id, title: title?.trim(), url };
    },
    getElements: () => page.locator(".elementor-shortcode").first().locator("a").all(),
    pageName: "levigo",
    pageUrl: "https://levigo.se/assignments/",
    playwrightPage: page,
    waitForSelector: ".elementor-shortcode",
  });
}
