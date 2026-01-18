import { chromium } from "playwright";
import { WebSocketServer } from "ws";

import { runScrapingProcess } from "./scrape-assignments/run-scraping-process";

const PORT = 8080;
const webSocketServer = new WebSocketServer({ port: PORT });

// eslint-disable-next-line unicorn/prefer-top-level-await
void (async () => {
  console.log("Launching browser...");
  const browser = await chromium.launch({ headless: true });
  console.log("Browser launched.");

  console.log(`WebSocket server started on port ${PORT}`);

  webSocketServer.on("connection", (webSocket) => {
    webSocket.on("message", () => {
      void runScrapingProcess(webSocket, browser);
    });
  });

  const cleanup = async () => {
    console.log("Closing browser...");
    await browser.close();
    console.log("Browser closed.");
  };

  process.on("SIGINT", () => {
    void cleanup();
  });
  process.on("SIGTERM", () => {
    void cleanup();
  });
})();
