import { IFilterState } from "@/context/state";
import { IStoreSet } from "@/context/store";

import { createClearActiveFilters } from "./clear-active-filters";
import { createLoadStoredAssignments } from "./load-stored-assignments";
import { createScrapeAssignments } from "./scrape-assignments";
import { createToggleActiveFilter } from "./toggle-active-filter";

export interface IActions {
  clearActiveFilters: () => void;
  loadStoredAssignments: () => Promise<void>;
  scrapeAssignments: () => Promise<void>;
  toggleActiveFilter: (filter: keyof IFilterState) => void;
}

export function getStoreActions(set: IStoreSet): IActions {
  return {
    clearActiveFilters: createClearActiveFilters(set),
    loadStoredAssignments: createLoadStoredAssignments(set),
    scrapeAssignments: createScrapeAssignments(set),
    toggleActiveFilter: createToggleActiveFilter(set),
  };
}
