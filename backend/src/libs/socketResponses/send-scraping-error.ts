import { WebSocket } from "ws";

export function sendScrapingError(webSocket: WebSocket, error: string) {
  webSocket.send(JSON.stringify({ message: error, type: "error" }));
}
