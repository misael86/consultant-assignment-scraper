import { chromium } from "playwright";

async function scrapeVerama() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto("https://app.verama.com/app/job-requests?page=0&size=1000");
  await page.waitForSelector(".route-section");

  const assignments = await page.evaluate(() => {
    return [...document.querySelectorAll(".route-section")].map((element) => ({
      source: "verama",
      title: element.querySelector(".el-header")?.textContent?.trim(),
      url: "https://app.verama.com/app" + element.attributes.getNamedItem("href")?.value.toString(),
    }));
  });

  await browser.close();

  return assignments;
}

export { scrapeVerama };
