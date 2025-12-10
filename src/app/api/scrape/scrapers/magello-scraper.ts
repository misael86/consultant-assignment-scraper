import { Page } from "playwright";

import { IAssignment } from "@/lib/scrape-response";

import { scrapeMultiplePages } from "./libs/scrape-multiple-pages";

export async function scrapeMagello(page: Page, existingKeys: string[]): Promise<IAssignment[]> {
  const visitedPages = ["Sida1"];
  return scrapeMultiplePages({
    existingAssignmentIds: existingKeys,
    getAssignmentData: async (element) => {
      const url = await element.getAttribute("href");
      const title = await element.textContent();
      return { id: url, title: title?.trim(), url };
    },
    getElements: async () => {
      await page.waitForSelector(".elementor-posts-container");
      return page.locator(".elementor-posts-container").first().locator("a").all();
    },
    goToNextPage: async () => {
      const links = await page.locator("a.page-numbers").all();
      for (const link of links) {
        const text = await link.textContent();
        if (!visitedPages.includes(text ?? "")) {
          visitedPages.push(text ?? "");
          await link.click();
          await page.waitForTimeout(500);
          break;
        }
      }
    },
    pageName: "magello",
    pageUrl: "https://connect.magello.se/aktuella-avrop/",
    playwrightPage: page,
  });
}
