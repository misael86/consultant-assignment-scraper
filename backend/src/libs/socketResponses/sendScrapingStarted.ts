import { WebSocket } from "ws";

export function sendScrapingStarted(webSocket: WebSocket) {
  webSocket.send(JSON.stringify({ type: "status", status: "scraping_started" }));
}
