import { chromium } from "playwright";

import { IAssignment } from "@/lib/scrape-response";

export async function scrapeASociety(): Promise<IAssignment[]> {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto("https://www.asocietygroup.com/sv/uppdrag?page=100");
  await page.waitForSelector('[class*="Assignment_assignmentComponent__"]');

  const assignments = await page.evaluate(() => {
    return [...document.querySelectorAll('[class*="Assignment_assignmentComponent__"]')].map((element) => {
      const url =
        "https://www.asocietygroup.com" + element.querySelector("a")?.attributes.getNamedItem("href")?.value.toString();
      return {
        key: url.slice(url.lastIndexOf("-") + 1) ?? crypto.randomUUID(),
        scraped: new Date().toLocaleDateString("sv-SE"),
        source: "a society",
        title: element.querySelector('[class*="Assignment_title__"]')?.textContent?.trim() ?? "N/A",
        url,
      };
    });
  });

  await browser.close();

  return assignments;
}
