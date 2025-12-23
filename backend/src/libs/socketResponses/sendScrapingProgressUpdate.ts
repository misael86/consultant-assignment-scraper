import { WebSocket } from "ws";

export function sendScrapingProgressUpdate(webSocket: WebSocket, completed: number) {
  webSocket.send(JSON.stringify({ type: "progress_update", completed }));
}
