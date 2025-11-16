import { chromium } from "playwright";

import { IAssignment } from "@/lib/scrape-response";

export async function scrapeCinode(): Promise<IAssignment[]> {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto("https://cinode.market/requests");
  await page.waitForSelector("app-list");

  const assignments = await page.evaluate(() => {
    return [...document.querySelectorAll("app-list-row")].map((element) => {
      const url =
        "https://cinode.market" + element.querySelector("a")?.attributes.getNamedItem("href")?.value.toString();
      return {
        key: url.slice(url.lastIndexOf("/") + 1) ?? crypto.randomUUID(),
        scraped: new Date().toLocaleDateString("sv-SE"),
        source: "cinode",
        title: element.querySelector("a")?.textContent?.trim() ?? "N/A",
        url,
      };
    });
  });

  await browser.close();

  return assignments;
}
