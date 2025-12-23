import { WebSocket } from "ws";

export function sendScrapingProgressInit(webSocket: WebSocket, total: number) {
  webSocket.send(JSON.stringify({ total, type: "progress_init" }));
}
