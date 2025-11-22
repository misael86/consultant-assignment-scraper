import filters from "@/context/filters.json";
import { IAssignment } from "@/lib/scrape-response";

export function isUX(assignment: IAssignment) {
  return filters.ux.some((filter) => assignment.title?.toLowerCase().includes(filter.toLowerCase()));
}
