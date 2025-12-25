import { IAssignment } from "@shared/assignment";

import { IAssignmentWithTags, IFilterState } from "./state";

export function sortAssignments<T extends IAssignment | IAssignmentWithTags>(assignments: T[]): T[] {
  return assignments.toSorted((a, b) => {
    if (a.scraped < b.scraped) {
      return 1;
    } else if (a.scraped > b.scraped) {
      return -1;
    }
    return 0;
  });
}

export function tagAssignments(assignments: IAssignment[], filters: IFilterState): IAssignmentWithTags[] {
  return assignments.map((assignment) => {
    const lowerCaseTitle = assignment.title?.toLowerCase();
    return {
      ...assignment,
      isA11y: filters.a11y.some((filter) => lowerCaseTitle?.includes(filter.toLowerCase())),
      isDevelopment: filters.development.some(
        (filter) => lowerCaseTitle?.includes(filter.toLowerCase()) && !lowerCaseTitle?.includes("uddevalla")
      ),
      isUX: filters.ux.some(
        (filter) =>
          lowerCaseTitle?.includes(filter.toLowerCase()) &&
          !lowerCaseTitle?.includes("linux") &&
          !lowerCaseTitle?.includes("benelux")
      ),
    };
  });
}
