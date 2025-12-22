import { IState } from "@/context/state";
import { IStoreSet } from "@/context/store";

export function createClearActiveFilters(set: IStoreSet) {
  return () => {
    set((state: IState) => ({
      activeFilters: { a11y: false, development: false, ux: false },
      assignments: { ...state.assignments, filteredAll: state.assignments.all, filteredNew: state.assignments.new },
    }));
  };
}
