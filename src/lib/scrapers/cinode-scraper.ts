import { Page } from "playwright";

import { IAssignment } from "@/lib/scrape-response";

export async function scrapeCinode(page: Page, storedAssignmentIds: string[]): Promise<IAssignment[]> {
  await page.goto("https://cinode.market/requests");
  await page.waitForSelector("app-list");

  return await page.evaluate((storedAssignmentIds) => {
    const assignments: IAssignment[] = [];
    const elements = document.querySelectorAll("app-list-row");

    for (const element of elements) {
      const url =
        "https://cinode.market" + element.querySelector("a")?.attributes.getNamedItem("href")?.value.toString();
      const key = url.slice(url.lastIndexOf("/") + 1) ?? crypto.randomUUID();

      if (storedAssignmentIds.includes(key)) break;

      const assignment = {
        key,
        scraped: new Date().toLocaleDateString("sv-SE"),
        source: "cinode",
        title: element.querySelector("a")?.textContent?.trim() ?? "N/A",
        url,
      };
      assignments.push(assignment);
    }

    return assignments;
  }, storedAssignmentIds);
}
