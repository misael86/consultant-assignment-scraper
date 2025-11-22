import { create } from "zustand";

import {
  createAddAssignments,
  createClearActiveFilters,
  createSetAssignments,
  createSetFilters,
  createToggleActiveFilter,
} from "./actions";
import { IActions, IState, IStore } from "./types";

export const useStore = create<IStore>((set) => {
  const state: IState = {
    activeFilters: { a11y: false, development: false, ux: false },
    assignments: [],
    filters: {
      a11y: [],
      development: [],
      ux: [],
    },
  };

  const actions: IActions = {
    addAssignments: createAddAssignments(set),
    clearActiveFilters: createClearActiveFilters(set),
    setAssignments: createSetAssignments(set),
    setFilters: createSetFilters(set),
    toggleActiveFilter: createToggleActiveFilter(set),
  };

  return { ...state, ...actions };
});
