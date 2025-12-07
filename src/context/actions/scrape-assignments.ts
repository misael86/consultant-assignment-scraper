import axios from "axios";

import { sortAssignments, tagAssignments } from "@/context/libs";
import { IState } from "@/context/state";
import { IStoreSet } from "@/context/store";
import { IAssignment } from "@/lib/scrape-response";

import { filterAssignments } from "./toggle-active-filter";

export function createScrapeAssignments(set: IStoreSet) {
  return async () => {
    set((state: IState) => ({
      assignments: {
        ...state.assignments,
        all: [...state.assignments.new, ...state.assignments.all],
        filteredAll: [...state.assignments.filteredNew, ...state.assignments.filteredAll],
        filteredNew: [],
        new: [],
      },
      isScrapingAssignments: true,
    }));

    const response = await axios.get<IAssignment[]>("/api/scrape");

    set((state: IState) => {
      const assignments = sortAssignments(tagAssignments(response.data, state.filters));

      return {
        assignments: {
          ...state.assignments,
          filteredNew: filterAssignments(assignments, state.activeFilters),
          new: assignments,
        },
        isScrapingAssignments: false,
      };
    });
  };
}
