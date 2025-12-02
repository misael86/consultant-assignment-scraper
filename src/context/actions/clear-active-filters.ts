import { IStoreSet } from "@/context/store";

export function createClearActiveFilters(set: IStoreSet) {
  return () => {
    set(() => ({ activeFilters: { a11y: false, development: false, ux: false } }));
  };
}
