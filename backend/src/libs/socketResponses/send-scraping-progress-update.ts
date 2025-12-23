import { WebSocket } from "ws";

export function sendScrapingProgressUpdate(webSocket: WebSocket, completed: number) {
  webSocket.send(JSON.stringify({ completed, type: "progress_update" }));
}
