import { Page } from "playwright";

import { IAssignment } from "@/lib/scrape-response";

export async function scrapeVerama(page: Page, storedAssignmentIds: string[]): Promise<IAssignment[]> {
  await page.goto("https://app.verama.com/app/job-requests?size=500");
  await page.waitForSelector(".route-section");

  return await page.evaluate((storedAssignmentIds) => {
    const assignments: IAssignment[] = [];
    const elements = document.querySelectorAll(".route-section");

    for (const element of elements) {
      const url = "https://app.verama.com/app" + element.attributes.getNamedItem("href")?.value.toString();
      const key = url.slice(url.lastIndexOf("/") + 1) ?? crypto.randomUUID();

      if (storedAssignmentIds.includes(key)) break;

      const assignment = {
        key,
        scraped: new Date().toLocaleDateString("sv-SE"),
        source: "verama",
        title: element.querySelector(".el-header")?.textContent?.trim() ?? "N/A",
        url,
      };
      assignments.push(assignment);
    }

    return assignments;
  }, storedAssignmentIds);
}
