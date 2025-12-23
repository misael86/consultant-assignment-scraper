import { WebSocket } from "ws";

export function sendScrapingCompleted(webSocket: WebSocket) {
  webSocket.send(JSON.stringify({ status: "scraping_completed", type: "status" }));
}
