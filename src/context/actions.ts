import axios from "axios";

import { IAssignment } from "@/lib/scrape-response";

import { IAssignmentWithTags, IFilterState, IState, IStoreSet } from "./types";

export const createClearActiveFilters = (set: IStoreSet) => () => {
  set(() => ({ activeFilters: { a11y: false, development: false, ux: false } }));
};

export function filterAssignments(assignments: IAssignment[], filters: IFilterState): IAssignmentWithTags[] {
  return assignments.map((assignment) => {
    const lowerCaseTitle = assignment.title?.toLowerCase();
    return {
      ...assignment,
      isA11y: filters?.a11y.some((filter) => lowerCaseTitle?.includes(filter.toLowerCase())),
      isDevelopment: filters?.development.some((filter) => lowerCaseTitle?.includes(filter.toLowerCase())),
      isUx: filters?.ux.some((filter) => lowerCaseTitle?.includes(filter.toLowerCase())),
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
    console.log("filter?", state.filters);
    const filteredAssignments = state.filters ? filterAssignments(assignments.data, state.filters) : assignments.data;
    return {
      assignments: [...(state.assignments ?? []), ...filteredAssignments],
      isLoadingAssignments: false,
    };
  });
};
