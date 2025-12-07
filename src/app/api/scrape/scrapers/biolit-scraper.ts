import { Page } from "playwright";

import { IAssignment } from "@/lib/scrape-response";

import { scrapeOnePage } from "./libs/scrape-one-page";

export async function scrapeBiolit(page: Page, existingKeys: string[]): Promise<IAssignment[]> {
  return scrapeOnePage({
    existingAssignmentIds: existingKeys,
    getAssignmentData: async (element) => {
      const url = "https://biolit.se/konsultuppdrag/";
      const id = await element.getAttribute("id");
      const title = await element.locator("b").first().textContent();
      return { id, title: title?.trim(), url };
    },
    getElements: () => page.locator(".collapsible").all(),
    pageName: "biolit",
    pageUrl: "https://biolit.se/konsultuppdrag/",
    playwrightPage: page,
    waitForSelector: ".collapsible",
  });
}
