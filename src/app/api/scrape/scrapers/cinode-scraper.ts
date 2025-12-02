import { Page } from "playwright";

import { IAssignment } from "@/lib/scrape-response";

export async function scrapeCinode(page: Page, existingKeys: string[]): Promise<IAssignment[]> {
  await page.goto("https://cinode.market/requests");
  await page.waitForSelector("app-list");
  await page.getByRole("button", { name: /Reject/i }).click();

  const assignments: IAssignment[] = [];
  let continueScraping = true;

  while (continueScraping) {
    const scrapedIds = new Set(assignments.map((assignment) => assignment.id));

    const newAssignments = await page.evaluate((existingKeys) => {
      const elements = document.querySelectorAll("app-list-row");
      if (elements.length === 0) throw new Error("No elements found for Cinode");
      const scrapedAssignments: IAssignment[] = [];

      for (const element of elements) {
        const domain = "https://cinode.market";
        const url = domain + element.querySelector("a")?.attributes.getNamedItem("href")?.value;
        const id = url.slice(url.lastIndexOf("/") + 1);
        const source = "cinode";
        const title = element.querySelector("a")?.textContent?.trim();
        const scraped = new Date().toLocaleDateString("sv-SE");

        if (existingKeys.includes(`${source}-${id}`)) {
          break;
        }

        scrapedAssignments.push({ id, scraped, source, title, url });
      }

      return scrapedAssignments;
    }, existingKeys);

    if (newAssignments.length === 0 || scrapedIds.has(newAssignments[0].id)) {
      continueScraping = false;
    } else {
      assignments.push(...newAssignments);
      await page.getByRole("button", { name: /Next page/i }).click();
    }
  }

  return assignments;
}
