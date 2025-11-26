import { Page } from "playwright";

import { IAssignment } from "@/lib/scrape-response";

export async function scrapeCombitech(page: Page, existingKeys: string[]): Promise<IAssignment[]> {
  await page.goto("https://partnernetworkportal.azurewebsites.net/");
  await page.waitForSelector('[class*="table-wrap"]');

  return await page.evaluate((keys) => {
    const assignments: IAssignment[] = [];
    const elements = [...new Set(document.querySelectorAll('[class*="grid-row"]'))].map((element) =>
      element.querySelector("a")
    );
    if (elements.length === 0) throw new Error("No elements found for Combitech");

    for (const element of elements) {
      if (!element) break;

      const domain = "https://partnernetworkportal.azurewebsites.net";
      const url = domain + element.attributes.getNamedItem("href")?.value;
      const id = url.replace("/assignmentdetails/", "").slice(0, url.lastIndexOf("/"));
      const source = "combitech";
      const title = element.textContent?.trim();
      const scraped = new Date().toLocaleDateString("sv-SE");

      if (keys.includes(`${source}-${id}`)) break;

      assignments.push({ id, scraped, source, title, url });
    }

    return assignments;
  }, existingKeys);
}
