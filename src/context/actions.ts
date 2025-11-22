import { IAssignment } from "@/lib/scrape-response";

import { IAssignmentWithTags, IFilterState, IState, IStoreSet } from "./types";

export const createAddAssignments = (set: IStoreSet) => (assignments: IAssignment[]) => {
  set((state: IState) => {
    const filteredAssignments: IAssignmentWithTags[] = state.filters
      ? filterAssignments(assignments, state.filters)
      : assignments;
    return { assignments: [...(state.assignments ?? []), ...filteredAssignments] };
  });
};

export const createClearActiveFilters = (set: IStoreSet) => () => {
  set(() => ({ activeFilters: { a11y: false, development: false, ux: false } }));
};

export const createSetAssignments = (set: IStoreSet) => (assignments: IAssignment[]) => {
  set(() => ({ assignments }));
};

export const createSetFilters = (set: IStoreSet) => (filters: IFilterState) => {
  set((state: IState) => {
    let filteredAssignments: IAssignmentWithTags[] | undefined;
    if (state.assignments) {
      filteredAssignments = filterAssignments(state.assignments, filters);
    }
    return { assignments: filteredAssignments, filters };
  });
};

function filterAssignments(assignments: IAssignment[], filters: IFilterState): IAssignmentWithTags[] {
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
