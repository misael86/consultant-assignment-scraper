import { Page } from "playwright";

import { IAssignment } from "@/lib/scrape-response";

export async function scrapeCinode(page: Page, existingKeys: string[]): Promise<IAssignment[]> {
  await page.goto("https://cinode.market/requests");
  await page.waitForSelector("app-list");

  return await page.evaluate((existingKeys) => {
    const assignments: IAssignment[] = [];
    const elements = document.querySelectorAll("app-list-row");

    for (const element of elements) {
      const domain = "https://cinode.market";
      const url = domain + element.querySelector("a")?.attributes.getNamedItem("href")?.value;
      const id = url.slice(url.lastIndexOf("/") + 1);
      const source = "cinode";
      const title = element.querySelector("a")?.textContent?.trim();
      const scraped = new Date().toLocaleDateString("sv-SE");

      if (existingKeys.includes(`${source}-${id}`)) break;

      assignments.push({ id, scraped, source, title, url });
    }

    return assignments;
  }, existingKeys);
}
