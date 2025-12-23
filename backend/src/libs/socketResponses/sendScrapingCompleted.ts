import { WebSocket } from "ws";

export function sendScrapingCompleted(webSocket: WebSocket) {
  webSocket.send(JSON.stringify({ type: "status", status: "scraping_completed" }));
}
