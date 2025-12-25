import { WebSocketServer } from "ws";

import { runScrapingProcess } from "./scrape-assignments/run-scraping-process";

const PORT = 8080;
const webSocketServer = new WebSocketServer({ port: PORT });

console.log(`WebSocket server started on port ${PORT}`);

webSocketServer.on("connection", (webSocket) => {
  webSocket.on("message", () => {
    void runScrapingProcess(webSocket);
  });
});
