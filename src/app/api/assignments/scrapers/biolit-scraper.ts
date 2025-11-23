import { Page } from "playwright";

import { IAssignment } from "@/lib/scrape-response";

export async function scrapeBiolit(page: Page, existingKeys: string[]): Promise<IAssignment[]> {
  await page.goto("https://biolit.se/konsultuppdrag/");
  await page.waitForSelector(".collapsible");

  return await page.evaluate((existingKeys) => {
    const assignments: IAssignment[] = [];
    const elements = document.querySelectorAll(".collapsible");

    for (const element of elements) {
      const url = "https://biolit.se/konsultuppdrag/";
      const id = element.attributes.getNamedItem("id")?.value;
      const source = "biolit";
      const title = element.querySelector("b")?.textContent?.trim();
      const scraped = new Date().toLocaleDateString("sv-SE");

      if (existingKeys.includes(`${source}-${id}`)) break;

      assignments.push({ id, scraped, source, title, url });
    }

    return assignments;
  }, existingKeys);
}
