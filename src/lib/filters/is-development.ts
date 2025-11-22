import filters from "@/context/filters.json";
import { IAssignment } from "@/lib/scrape-response";

export function isDevelopment(assignment: IAssignment) {
  return filters.dev.some((filter) => assignment.title?.toLowerCase().includes(filter.toLowerCase()));
}
