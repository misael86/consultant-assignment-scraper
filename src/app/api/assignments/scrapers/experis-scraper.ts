import { Page } from "playwright";

import { IAssignment } from "@/lib/scrape-response";

export async function scrapeExperis(page: Page, existingKeys: string[]): Promise<IAssignment[]> {
  await page.goto("https://www.experis.se/sv/sok");
  await page.waitForSelector(".job-position");
  await page.getByRole("button", { name: /Avvisa alla/i }).click();

  return await page.evaluate((keys) => {
    const assignments: IAssignment[] = [];
    const elements = document.querySelectorAll(".job-position");
    if (elements.length === 0) throw new Error("No elements found for Experis");

    for (const element of elements) {
      if (!element) break;

      const url = element.querySelector("a")?.attributes.getNamedItem("href")?.value ?? "";
      const id = url?.replace("/sv/jobb/", "").slice(0, url.lastIndexOf("/"));
      const source = "experis";
      const title = element.textContent?.trim();
      const scraped = new Date().toLocaleDateString("sv-SE");

      if (keys.includes(`${source}-${id}`)) break;

      assignments.push({ id, scraped, source, title, url });
    }

    return assignments;
  }, existingKeys);
}
