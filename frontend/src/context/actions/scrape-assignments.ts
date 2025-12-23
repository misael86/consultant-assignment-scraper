import { sortAssignments, tagAssignments } from "@/context/libs";
import { IState } from "@/context/state";
import { IStoreSet } from "@/context/store";
import { IAssignment } from "@/lib/scrape-response";
import { SocketService } from "@/lib/socket";

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

    const socketService = SocketService.getInstance();
    
    const unsubscribe = socketService.subscribe((data) => {
      if (data.type === "new_assignments") {
        const newAssignments: IAssignment[] = data.assignments;
        
        set((state: IState) => {
          const taggedAssignments = sortAssignments(tagAssignments(newAssignments, state.filters));
          return {
            assignments: {
              ...state.assignments,
              filteredNew: [...state.assignments.filteredNew, ...filterAssignments(taggedAssignments, state.activeFilters)],
              new: [...state.assignments.new, ...taggedAssignments],
            },
          };
        });
      }

      if (data.type === "status" && data.status === "scraping_completed") {
        set(() => ({ isScrapingAssignments: false }));
        unsubscribe();
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
