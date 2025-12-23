import { Low } from "lowdb";
import { JSONFilePreset } from "lowdb/node";
import { IAssignment } from "models/assignment";

// TODO: Make the path configurable or shared with frontend if needed.
// For now, writing to a file in the backend directory or a shared location.
// Creating a data directory in backend for now.
const DB_PATH = "../frontend/public/assignments.json";

export async function getDatabase() {
  const defaultData: IAssignment[] = [];
  return await JSONFilePreset<IAssignment[]>(DB_PATH, defaultData);
}

export async function storeAssignments(assignments: IAssignment[], database: Low<IAssignment[]>): Promise<void> {
  database.data.push(...assignments);
  await database.write();
}
