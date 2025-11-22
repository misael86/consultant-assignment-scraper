import { JSONFilePreset } from "lowdb/node";

import { IAssignment } from "@/lib/scrape-response";

export async function loadAssignments() {
  const assignmentDatabase = await JSONFilePreset<IAssignment[]>("./src/context/assignments.json", []);
  return assignmentDatabase.data;
}
