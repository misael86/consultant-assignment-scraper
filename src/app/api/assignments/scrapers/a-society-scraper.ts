import { Page } from "playwright";

import { IAssignment } from "@/lib/scrape-response";

export async function scrapeASociety(page: Page, existingKeys: string[]): Promise<IAssignment[]> {
  await page.goto("https://www.asocietygroup.com/sv/uppdrag?page=100");
  await page.waitForSelector('[class*="Assignment_assignmentComponent__"]');

  return await page.evaluate((keys) => {
    const assignments: IAssignment[] = [];
    const elements = document.querySelectorAll('[class*="Assignment_assignmentComponent__"]');

    for (const element of elements) {
      const domain = "https://www.asocietygroup.com";
      const url = domain + element.querySelector("a")?.attributes.getNamedItem("href")?.value;
      const id = url.slice(url.lastIndexOf("-") + 1);
      const source = "a society";
      const title = element.querySelector('[class*="Assignment_title__"]')?.textContent?.trim();
      const scraped = new Date().toLocaleDateString("sv-SE");

      if (keys.includes(`${source}-${id}`)) break;

      assignments.push({ id, scraped, source, title, url });
    }

    return assignments;
  }, existingKeys);
}
