import { WebSocket } from "ws";

export function sendScrapingStarted(webSocket: WebSocket) {
  webSocket.send(JSON.stringify({ status: "scraping_started", type: "status" }));
}
