import filters from "@/context/filters.json";
import { IAssignment } from "@/lib/scrape-response";

export function isA11y(assignment: IAssignment) {
  return filters.a11y.some((filter) => assignment.title?.toLowerCase().includes(filter.toLowerCase()));
}
