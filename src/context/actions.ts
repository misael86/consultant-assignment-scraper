import axios from "axios";

import { IAssignment } from "@/lib/scrape-response";

import { sortAssignments, tagAssignments } from "./libs";
import { IFilterState, IState } from "./state";
import { IStoreSet } from "./store";

const createClearActiveFilters = (set: IStoreSet) => () => {
  set(() => ({ activeFilters: { a11y: false, development: false, ux: false } }));
};

const createToggleActiveFilter = (set: IStoreSet) => (filter: keyof IFilterState) => {
  // eslint-disable-next-line security/detect-object-injection
  set((state: IState) => ({ activeFilters: { ...state.activeFilters, [filter]: !state.activeFilters[filter] } }));
};

const createScrapeAssignments = (set: IStoreSet) => async () => {
  set(() => ({ isLoadingAssignments: true }));
  const assignments = await axios.get<IAssignment[]>("/api/assignments");
  set((state: IState) => {
    const existingKeys = new Set(state.assignments.map((assignment) => `${assignment.source}-${assignment.id}`));
    const newAssignments = assignments.data.filter(
      (assignment) => !existingKeys.has(`${assignment.source}-${assignment.id}`)
    );

    const tagedAssignments = sortAssignments(tagAssignments(newAssignments, state.filters));

    return {
      assignments: [...(state.assignments ?? []), ...tagedAssignments],
      isLoadingAssignments: false,
    };
  });
};

export interface IActions {
  clearActiveFilters: () => void;
  scrapeAssignments: () => Promise<void>;
  toggleActiveFilter: (filter: keyof IFilterState) => void;
}

export function getStoreActions(set: IStoreSet): IActions {
  return {
    clearActiveFilters: createClearActiveFilters(set),
    scrapeAssignments: createScrapeAssignments(set),
    toggleActiveFilter: createToggleActiveFilter(set),
  };
}
