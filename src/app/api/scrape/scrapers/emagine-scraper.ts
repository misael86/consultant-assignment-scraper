import { Page } from "playwright";

import { IAssignment } from "@/lib/scrape-response";

import { scrapeMultiplePages } from "./libs/scrape-multiple-pages";

export async function scrapeEmagine(page: Page, existingKeys: string[]): Promise<IAssignment[]> {
  return scrapeMultiplePages({
    existingAssignmentIds: existingKeys,
    getAssignmentData: async (element) => {
      const url = "https://portal.emagine.org/jobs/all";
      const id = await element.locator(".text-text-tertiary.flex.text-xs").textContent();
      const title = await element.locator("h2").textContent();
      return { id, title: title?.trim(), url };
    },
    getElements: () => page.locator("job-grid-item").all(),
    goToNextPage: async () => {
      const nextButton = page.locator("button.mat-mdc-paginator-navigation-next").first();
      if (await nextButton.isDisabled()) return;
      await nextButton.click();
      await page.waitForTimeout(1000);
    },
    pageName: "emagine",
    pageUrl: "https://portal.emagine.org/jobs/all",
    playwrightPage: page,
    preScrapeJob: async () => {
      await page.waitForTimeout(500);
      await page.getByRole("button", { name: /Allow selection/i }).click();
    },
    waitForSelector: "job-grid-item",
  });
}
