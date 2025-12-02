import { Page } from "playwright";

import { IAssignment } from "@/lib/scrape-response";

export async function scrapeEpico(page: Page, existingKeys: string[]): Promise<IAssignment[]> {
  await page.goto("https://jobs.epico.se/jobs");
  await page.waitForSelector("#jobs_list_container");

  return await page.evaluate((keys) => {
    const assignments: IAssignment[] = [];
    const elements = document.querySelector("#jobs_list_container")?.querySelectorAll("a") ?? [];
    if (elements.length === 0) throw new Error("No elements found for Epico");

    for (const element of elements) {
      if (!element) break;

      const url = element.attributes.getNamedItem("href")?.value ?? "";
      const id = url?.replace("https://jobs.epico.se/jobs/", "").slice(0, url.lastIndexOf("-"));
      const source = "epico";
      const title = element.textContent?.trim();
      const scraped = new Date().toLocaleDateString("sv-SE");

      if (keys.includes(`${source}-${id}`)) break;

      assignments.push({ id, scraped, source, title, url });
    }

    return assignments;
  }, existingKeys);
}
