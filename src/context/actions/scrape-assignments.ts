import axios from "axios";

import { sortAssignments, tagAssignments } from "@/context/libs";
import { IState } from "@/context/state";
import { IStoreSet } from "@/context/store";
import { IAssignment } from "@/lib/scrape-response";

export function createScrapeAssignments(set: IStoreSet) {
  return async () => {
    set(() => ({ isScrapingAssignments: true }));
    const response = await axios.get<IAssignment[]>("/api/scrape");
    set((state: IState) => {
      const assignments = sortAssignments(tagAssignments(response.data, state.filters));

      return {
        assignments: [...(state.assignments ?? []), ...assignments],
        isScrapingAssignments: false,
        newAssignments: assignments,
      };
    });
  };
}
