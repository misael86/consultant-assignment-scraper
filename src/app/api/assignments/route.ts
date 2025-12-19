import { Low } from "lowdb";
import { JSONFilePreset } from "lowdb/node";

import { IAssignment } from "@/lib/scrape-response";

export async function GET() {
  console.log("GET assignments");
  const database = await JSONFilePreset<IAssignment[]>("./public/assignments.json", []);
  await removeOldAssignments(database);
  return Response.json(database.data);
}

async function removeOldAssignments(database: Low<IAssignment[]>) {
  const savedSources: string[] = [];
  const filteredData = database.data.toReversed().filter((assignment) => {
    if (!savedSources.includes(assignment.source)) {
      savedSources.push(assignment.source);
      return true;
    }

    const lastWeek = new Date();
    const lastWeekDate = lastWeek.getUTCDate() - 7;
    lastWeek.setUTCDate(lastWeekDate);
    return assignment.scraped > lastWeek.toLocaleDateString("sv-SE");
  });
  database.data = filteredData.toReversed();
  await database.write();
}
