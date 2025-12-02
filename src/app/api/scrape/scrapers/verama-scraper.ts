import { Page } from "playwright";

import { IAssignment } from "@/lib/scrape-response";

export async function scrapeVerama(page: Page, existingKeys: string[]): Promise<IAssignment[]> {
  await page.goto("https://app.verama.com/app/job-requests?size=500");
  await page.waitForSelector("a.route-section");

  return await page.evaluate((existingKeys) => {
    const assignments: IAssignment[] = [];
    const elements = document.querySelectorAll("a.route-section");
    if (elements.length === 0) throw new Error("No elements found for Verama");

    for (const element of elements) {
      const domain = "https://app.verama.com";
      const url = domain + element.attributes.getNamedItem("href")?.value;
      const id = url.slice(url.lastIndexOf("/") + 1);
      const source = "verama";
      const title = element.querySelector(".el-header")?.textContent?.trim();
      const scraped = new Date().toLocaleDateString("sv-SE");

      if (existingKeys.includes(`${source}-${id}`)) break;

      assignments.push({ id, scraped, source, title, url });
    }

    return assignments;
  }, existingKeys);
}
