import { Page } from "playwright";

import { IAssignment } from "@/lib/scrape-response";

export async function scrapeAliant(page: Page, existingKeys: Set<string>): Promise<IAssignment[]> {
  await page.goto("https://aliant.recman.se");
  await page.waitForSelector("#job-post-listing-box");

  return await page.evaluate((existingKeys) => {
    const assignments: IAssignment[] = [];
    const elements = document.querySelector("#job-post-listing-box")?.querySelectorAll('[class="box"]') ?? [];

    for (const element of elements) {
      const domain = "https://aliant.recman.se";
      const url =
        domain + element.attributes.getNamedItem("onclick")?.value.replaceAll("'", "").replace("location.href=", "");
      const id = url.slice(url.lastIndexOf("/") + 1);
      const source = "aliant";
      const title = element.querySelector("span")?.textContent?.trim();
      const scraped = new Date().toLocaleDateString("sv-SE");

      if (existingKeys.has(`${source}-${id}`)) break;

      assignments.push({ id, scraped, source, title, url });
    }

    return assignments;
  }, existingKeys);
}
