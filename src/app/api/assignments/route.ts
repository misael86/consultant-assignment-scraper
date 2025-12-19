import { JSONFilePreset } from "lowdb/node";

import { IAssignment } from "@/lib/scrape-response";

export async function GET() {
  console.log("GET assignments");
  const database = await JSONFilePreset<IAssignment[]>("./public/assignments.json", []);
  database.data = database.data.filter((assignment) => {
    const lastWeek = new Date();
    const lastWeekDate = lastWeek.getUTCDate() - 7;
    lastWeek.setUTCDate(lastWeekDate);
    return assignment.scraped > lastWeek.toLocaleDateString("sv-SE");
  });
  await database.write();
  return Response.json(database.data);
}
