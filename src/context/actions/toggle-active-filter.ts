import { IFilterState, IState } from "@/context/state";
import { IStoreSet } from "@/context/store";

export function createToggleActiveFilter(set: IStoreSet) {
  return (filter: keyof IFilterState) => {
    // eslint-disable-next-line security/detect-object-injection
    set((state: IState) => ({ activeFilters: { ...state.activeFilters, [filter]: !state.activeFilters[filter] } }));
  };
}
