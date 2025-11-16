import { chromium } from "playwright";

import { IAssignment } from "@/lib/scrape-response";

export async function scrapeVerama(): Promise<IAssignment[]> {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto("https://app.verama.com/app/job-requests?size=500");
  await page.waitForSelector(".route-section");

  const assignments = await page.evaluate(() => {
    return [...document.querySelectorAll(".route-section")].map((element) => {
      const url = "https://app.verama.com/app" + element.attributes.getNamedItem("href")?.value.toString();
      return {
        key: url.slice(url.lastIndexOf("/") + 1) ?? crypto.randomUUID(),
        scraped: new Date().toLocaleDateString("sv-SE"),
        source: "verama",
        title: element.querySelector(".el-header")?.textContent?.trim() ?? "N/A",
        url,
      };
    });
  });

  await browser.close();

  return assignments;
}
