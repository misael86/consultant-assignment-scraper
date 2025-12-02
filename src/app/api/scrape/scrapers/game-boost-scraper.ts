import { Page } from "playwright";

import { IAssignment } from "@/lib/scrape-response";

export async function scrapeGameBoost(page: Page, existingKeys: string[]): Promise<IAssignment[]> {
  await page.goto("https://www.gameboost.se/jobs");
  await page.waitForSelector(".jobs-list-container");

  return await page.evaluate((keys) => {
    const assignments: IAssignment[] = [];
    const elements = document.querySelector(".jobs-list-container")?.querySelectorAll("a") ?? [];
    if (elements.length === 0) throw new Error("No elements found for Game Boost");

    for (const element of elements) {
      if (!element) break;

      const url = element.attributes.getNamedItem("href")?.value ?? "";
      const id = url?.slice(url.lastIndexOf("/") + 1, url.indexOf("-"));
      const source = "game boost";
      const title = element.textContent?.trim();
      const scraped = new Date().toLocaleDateString("sv-SE");

      if (keys.includes(`${source}-${id}`)) break;

      assignments.push({ id, scraped, source, title, url });
    }

    return assignments;
  }, existingKeys);
}
