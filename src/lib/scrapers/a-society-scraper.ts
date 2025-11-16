import { Page } from "playwright";

import { IAssignment } from "@/lib/scrape-response";

export async function scrapeASociety(page: Page, storedAssignmentIds: string[]): Promise<IAssignment[]> {
  await page.goto("https://www.asocietygroup.com/sv/uppdrag?page=100");
  await page.waitForSelector('[class*="Assignment_assignmentComponent__"]');

  return await page.evaluate((storedAssignmentIds) => {
    const assignments: IAssignment[] = [];
    const elements = document.querySelectorAll('[class*="Assignment_assignmentComponent__"]');

    for (const element of elements) {
      const url =
        "https://www.asocietygroup.com" + element.querySelector("a")?.attributes.getNamedItem("href")?.value.toString();
      const key = url.slice(url.lastIndexOf("-") + 1) ?? crypto.randomUUID();

      if (storedAssignmentIds.includes(key)) break;

      const assignment = {
        key,
        scraped: new Date().toLocaleDateString("sv-SE"),
        source: "a society",
        title: element.querySelector('[class*="Assignment_title__"]')?.textContent?.trim() ?? "N/A",
        url,
      };
      assignments.push(assignment);
    }

    return assignments;
  }, storedAssignmentIds);
}
