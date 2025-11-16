import { Page } from "playwright";

import { IAssignment } from "@/lib/scrape-response";

export async function scrapeBiolit(page: Page, storedAssignmentIds: string[]): Promise<IAssignment[]> {
  await page.goto("https://biolit.se/konsultuppdrag/");
  await page.waitForSelector(".collapsible");

  return await page.evaluate((storedAssignmentIds) => {
    const assignments: IAssignment[] = [];
    const elements = document.querySelectorAll(".collapsible");

    for (const element of elements) {
      const url = "https://biolit.se/konsultuppdrag/";
      const key = element.attributes.getNamedItem("id")?.value.toString() ?? crypto.randomUUID();

      if (storedAssignmentIds.includes(key)) break;

      const assignment = {
        key,
        scraped: new Date().toLocaleDateString("sv-SE"),
        source: "biolit",
        title: element.querySelector("b")?.textContent?.trim() ?? "N/A",
        url,
      };

      assignments.push(assignment);
    }

    return assignments;
  }, storedAssignmentIds);
}
