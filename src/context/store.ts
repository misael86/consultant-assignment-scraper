import { create } from "zustand";

import assignments from "@/context/assignments.json";
import filters from "@/context/filters.json";

import {
  createClearActiveFilters,
  createScrapeAssignments,
  createToggleActiveFilter,
  filterAssignments,
} from "./actions";
import { IActions, IState, IStore } from "./types";

export const useStore = create<IStore>((set) => {
  const state: IState = {
    activeFilters: { a11y: false, development: true, ux: false },
    assignments: filterAssignments(assignments, filters),
    filters,
    isLoadingAssignments: false,
  };

  const actions: IActions = {
    clearActiveFilters: createClearActiveFilters(set),
    scrapeAssignments: createScrapeAssignments(set),
    toggleActiveFilter: createToggleActiveFilter(set),
  };

  return { ...state, ...actions };
});
