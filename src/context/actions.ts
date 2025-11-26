import axios from "axios";

import { IAssignment } from "@/lib/scrape-response";

import { IAssignmentWithTags, IFilterState, IState, IStoreSet } from "./types";

export const createClearActiveFilters = (set: IStoreSet) => () => {
  set(() => ({ activeFilters: { a11y: false, development: false, ux: false } }));
};

export function tagAssignments(assignments: IAssignment[], filters: IFilterState): IAssignmentWithTags[] {
  return assignments.map((assignment) => {
    const lowerCaseTitle = assignment.title?.toLowerCase();
    return {
      ...assignment,
      isA11y: filters.a11y.some((filter) => lowerCaseTitle?.includes(filter.toLowerCase())),
      isDevelopment: filters.development.some((filter) => lowerCaseTitle?.includes(filter.toLowerCase())),
      isUX: filters.ux.some(
        (filter) =>
          lowerCaseTitle?.includes(filter.toLowerCase()) &&
          !lowerCaseTitle?.includes("linux") &&
          !lowerCaseTitle?.includes("benelux")
      ),
    };
  });
}

export const createToggleActiveFilter = (set: IStoreSet) => (filter: keyof IFilterState) => {
  // eslint-disable-next-line security/detect-object-injection
  set((state: IState) => ({ activeFilters: { ...state.activeFilters, [filter]: !state.activeFilters[filter] } }));
};

export const createScrapeAssignments = (set: IStoreSet) => async () => {
  set(() => ({ isLoadingAssignments: true }));
  const assignments = await axios.get<IAssignment[]>("/api/assignments");
  set((state: IState) => {
    const existingKeys = new Set(state.assignments.map((assignment) => `${assignment.source}-${assignment.id}`));
    const newAssignments = assignments.data.filter(
      (assignment) => !existingKeys.has(`${assignment.source}-${assignment.id}`)
    );

    const tagedAssignments = sort(tagAssignments(newAssignments, state.filters));

    return {
      assignments: [...(state.assignments ?? []), ...tagedAssignments],
      isLoadingAssignments: false,
    };
  });
};

export function sort<T extends IAssignment | IAssignmentWithTags>(assignments: T[]): T[] {
  return assignments.toSorted((a, b) => {
    if (a.scraped < b.scraped) {
      return 1;
    }
    if (a.scraped > b.scraped) {
      return -1;
    }
    return 0;
  });
}
