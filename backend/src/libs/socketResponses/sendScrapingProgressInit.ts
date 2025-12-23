import { WebSocket } from "ws";

export function sendScrapingProgressInit(webSocket: WebSocket, total: number) {
  webSocket.send(JSON.stringify({ type: "progress_init", total }));
}
