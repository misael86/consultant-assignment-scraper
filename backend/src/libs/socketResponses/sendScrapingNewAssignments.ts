import { WebSocket } from "ws";
import { IAssignment } from "../../models/assignment";

export function sendScrapingNewAssignments(webSocket: WebSocket, assignments: IAssignment[]) {
  webSocket.send(JSON.stringify({ type: "new_assignments", assignments }));
}
