import { IActiveFilterState, IAssignmentWithTags, IFilterState, IState } from "@/context/state";
import { IStoreSet } from "@/context/store";

export function createToggleActiveFilter(set: IStoreSet) {
  return (filter: keyof IFilterState) => {
    // eslint-disable-next-line security/detect-object-injection
    set((state: IState) => ({ activeFilters: { ...state.activeFilters, [filter]: !state.activeFilters[filter] } }));
    set((state: IState) => {
      return {
        assignments: {
          ...state.assignments,
          filteredAll: filterAssignments(state.assignments.all, state.activeFilters),
          filteredNew: filterAssignments(state.assignments.new, state.activeFilters),
        },
      };
    });
  };
}

export function filterAssignments(assignments: IAssignmentWithTags[], activeFilters: IActiveFilterState) {
  const { a11y, development, ux } = activeFilters;
  return assignments.filter(
    (assignment) =>
      (!development && !a11y && !ux) ||
      (development && assignment.isDevelopment === true) ||
      (ux && assignment.isUX === true) ||
      (a11y && assignment.isA11y === true)
  );
}
