import { Page } from "playwright";

import { IAssignment } from "../types";

import { scrapeOnePage } from "./libs/scrape-one-page";

export async function scrapeCombitech(page: Page, existingKeys: string[]): Promise<IAssignment[]> {
  return scrapeOnePage({
    existingAssignmentIds: existingKeys,
    getAssignmentData: async (element) => {
      const domain = "https://partnernetworkportal.azurewebsites.net";
      const anchorElement = element.locator("a").first();
      const anchorHref = await anchorElement.getAttribute("href");
      const url = domain + anchorHref;
      let id = anchorHref?.replace("/assignmentdetails/", "");
      id = id?.slice(0, id.lastIndexOf("/"));
      const title = await anchorElement.textContent();
      return { id, title: title?.trim(), url };
    },
    getElements: async () => {
      await page.waitForSelector(".grid-row");
      return page.locator(".grid-row").all();
    },
    pageName: "combitech",
    pageUrl: "https://partnernetworkportal.azurewebsites.net/",
    playwrightPage: page,
  });
}
