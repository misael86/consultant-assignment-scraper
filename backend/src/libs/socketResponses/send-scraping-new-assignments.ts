import { IAssignment } from "models/assignment";
import { WebSocket } from "ws";

export function sendScrapingNewAssignments(webSocket: WebSocket, assignments: IAssignment[]) {
  webSocket.send(JSON.stringify({ assignments, type: "new_assignments" }));
}
