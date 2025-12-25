import { ScrapeAssignmentsEventResponse } from "@shared/server-event";
import { WebSocket } from "ws";

export function sendEvent(webSocket: WebSocket, event: ScrapeAssignmentsEventResponse) {
  webSocket.send(JSON.stringify(event));
}