import { Page } from "playwright";

import { IAssignment } from "@/lib/scrape-response";

export async function scrapeAliant(page: Page, storedAssignmentIds: string[]): Promise<IAssignment[]> {
  await page.goto("https://aliant.recman.se");
  await page.waitForSelector("#job-post-listing-box");

  return await page.evaluate((storedAssignmentIds) => {
    const assignments: IAssignment[] = [];
    const elements = document.querySelector("#job-post-listing-box")?.querySelectorAll('[class="box"]') ?? [];

    for (const element of elements) {
      const url =
        "https://aliant.recman.se" +
        element.attributes.getNamedItem("onclick")?.value.replaceAll("'", "").replace("location.href=", "").toString();
      const key = url.slice(url.lastIndexOf("/") + 1) ?? crypto.randomUUID();

      if (storedAssignmentIds.includes(key)) break;

      const assignment = {
        key,
        scraped: new Date().toLocaleDateString("sv-SE"),
        source: "aliant",
        title: element.querySelector("span")?.textContent?.trim() ?? "N/A",
        url,
      };
      assignments.push(assignment);
    }

    return assignments;
  }, storedAssignmentIds);
}
