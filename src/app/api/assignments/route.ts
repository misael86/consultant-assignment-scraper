import { JSONFilePreset } from "lowdb/node";

import { IAssignment } from "@/lib/scrape-response";

export async function GET() {
  const database = await JSONFilePreset<IAssignment[]>("./public/assignments.json", []);
  return Response.json(database.data);
}
