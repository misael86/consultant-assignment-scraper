import { IAssignment } from "@shared/assignment";

import { sortAssignments, tagAssignments } from "@/context/libs";
import { IState } from "@/context/state";
import { IStoreSet } from "@/context/store";
import { SocketService } from "@/lib/socket";

import { filterAssignments } from "./toggle-active-filter";

export function createScrapeAssignments(set: IStoreSet) {
  return () => {
    set((state: IState) => ({
      assignments: {
        ...state.assignments,
        all: [...state.assignments.new, ...state.assignments.all],
        filteredAll: [...state.assignments.filteredNew, ...state.assignments.filteredAll],
        filteredNew: [],
        hasScrapedNrAssignments: 0,
        isScrapingNrAssignments: 0,
        new: [],
      },
      hasScrapedNrAssignments: 0,
      isScrapingAssignments: true,
      isScrapingNrAssignments: 0,
    }));

    const socketService = SocketService.getInstance();

    const unsubscribe = socketService.subscribe((data) => {
      if (data.type === "new_assignments") {
        const newAssignments: IAssignment[] = data.assignments;

        set((state: IState) => {
          const taggedAssignments = sortAssignments(tagAssignments(newAssignments, state.filters));
          return {
            assignments: {
              ...state.assignments,
              filteredNew: [
                ...state.assignments.filteredNew,
                ...filterAssignments(taggedAssignments, state.activeFilters),
              ],
              new: [...state.assignments.new, ...taggedAssignments],
            },
            hasScrapedNrAssignments: state.hasScrapedNrAssignments + 1,
          };
        });
      }

      if (data.type === "scraping_completed") {
        set(() => ({ isScrapingAssignments: false }));
        unsubscribe();
      }

      if (data.type === "scraping_started") {
        set(() => ({ isScrapingNrAssignments: data.totalScrapers }));
      }

      if (data.type === "error") {
        console.error("Scraping error:", data.message);
        set(() => ({ isScrapingAssignments: false }));
        unsubscribe();
      }
    });

    socketService.send({ type: "start_scrape" });
  };
}
