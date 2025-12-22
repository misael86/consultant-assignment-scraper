import axios from "axios";

import { sortAssignments, tagAssignments } from "@/context/libs";
import { IState } from "@/context/state";
import { IStoreSet } from "@/context/store";
import { IAssignment } from "@/lib/scrape-response";

import { filterAssignments } from "./toggle-active-filter";

export function createLoadStoredAssignments(set: IStoreSet) {
  return async () => {
    set(() => ({ isLoadingAssignments: true }));
    const response = await axios.get<IAssignment[]>("/api/assignments");
    set((state: IState) => {
      const assignments = sortAssignments(tagAssignments(response.data, state.filters));

      return {
        assignments: {
          ...state.assignments,
          all: assignments,
          filteredAll: filterAssignments(assignments, state.activeFilters),
        },
        isLoadingAssignments: false,
      };
    });
  };
}
