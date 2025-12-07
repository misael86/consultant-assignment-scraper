import { Page } from "playwright";

import { IAssignment } from "@/lib/scrape-response";

import { scrapeOnePage } from "./libs/scrape-one-page";

export async function scrapeKantur(page: Page, existingKeys: string[]): Promise<IAssignment[]> {
  return scrapeOnePage({
    existingAssignmentIds: existingKeys,
    getAssignmentData: async (element) => {
      const url = "https://kantur.se/projects";
      const leadKey = await element.getAttribute("data-lead-key");
      const id = leadKey?.slice(url.indexOf("-") + 1);
      const title = await element.textContent();
      return { id, title: title?.trim(), url };
    },
    getElements: () => page.locator(".lead-summary").all(),
    pageName: "kantur",
    pageUrl: "https://kantur.se/projects",
    playwrightPage: page,
    waitForSelector: ".lead-summary",
  });
}
