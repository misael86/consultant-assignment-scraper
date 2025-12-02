import { Page } from "playwright";

import { IAssignment } from "@/lib/scrape-response";

export async function scrapeFunctionalSoftware(page: Page, existingKeys: string[]): Promise<IAssignment[]> {
  await page.goto("https://functionalsoftware.se/jobs/");
  await page.waitForSelector(".list-unstyled");

  return await page.evaluate((keys) => {
    const assignments: IAssignment[] = [];
    const elements = document.querySelector(".list-unstyled")?.querySelectorAll("a") ?? [];
    if (elements.length === 0) throw new Error("No elements found for Functional Software");

    for (const element of elements) {
      if (!element) break;

      const domain = "https://functionalsoftware.se";
      const url = domain + (element.attributes.getNamedItem("href")?.value ?? "");
      const id = url?.slice(url.lastIndexOf("/") + 1);
      const source = "functional software";
      const title = element.textContent?.trim();
      const scraped = new Date().toLocaleDateString("sv-SE");

      if (keys.includes(`${source}-${id}`)) break;

      assignments.push({ id, scraped, source, title, url });
    }

    return assignments;
  }, existingKeys);
}
