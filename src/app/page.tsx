import { AssignmentScraper } from "@/components/assignment-scraper";
import { scrapeAssignments } from "@/lib/scrape-assignments";

export default async function Home() {
  const assignments = await scrapeAssignments();

  return <AssignmentScraper assignments={assignments} />;
}
