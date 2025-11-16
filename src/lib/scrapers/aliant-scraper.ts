import { chromium } from "playwright";

import { IAssignment } from "@/lib/scrape-response";

export async function scrapeAliant(): Promise<IAssignment[]> {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto("https://aliant.recman.se");
  await page.waitForSelector("#job-post-listing-box");

  const assignments = await page.evaluate(() => {
    return [...(document.querySelector("#job-post-listing-box")?.querySelectorAll('[class="box"]') ?? [])].map(
      (element) => {
        const url =
          "https://aliant.recman.se" +
          element.attributes
            .getNamedItem("onclick")
            ?.value.replaceAll("'", "")
            .replace("location.href=", "")
            .toString();
        return {
          key: url.slice(url.lastIndexOf("/") + 1) ?? crypto.randomUUID(),
          scraped: new Date().toLocaleDateString("sv-SE"),
          source: "aliant",
          title: element.querySelector("span")?.textContent?.trim() ?? "N/A",
          url,
        };
      }
    );
  });

  await browser.close();

  return assignments;
}
