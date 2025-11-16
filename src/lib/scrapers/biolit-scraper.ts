import { chromium } from "playwright";

import { IAssignment } from "@/lib/scrape-response";

export async function scrapeBiolit(): Promise<IAssignment[]> {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto("https://biolit.se/konsultuppdrag/");
  await page.waitForSelector(".collapsible");

  const assignments = await page.evaluate(() => {
    return [...document.querySelectorAll(".collapsible")].map((element) => {
      const url = "https://biolit.se/konsultuppdrag/";
      return {
        key: element.attributes.getNamedItem("id")?.value.toString() ?? crypto.randomUUID(),
        scraped: new Date().toLocaleDateString("sv-SE"),
        source: "biolit",
        title: element.querySelector("b")?.textContent?.trim() ?? "N/A",
        url,
      };
    });
  });

  await browser.close();

  return assignments;
}
