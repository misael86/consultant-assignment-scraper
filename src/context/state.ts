import { IAssignment } from "@/lib/scrape-response";

export interface IActiveFilterState {
  a11y: boolean;
  development: boolean;
  ux: boolean;
}

export interface IAssignmentTag {
  isA11y?: boolean;
  isDevelopment?: boolean;
  isUX?: boolean;
}

export type IAssignmentWithTags = IAssignment & IAssignmentTag;

export interface IFilterState {
  a11y: string[];
  development: string[];
  ux: string[];
}

export interface IState {
  activeFilters: IActiveFilterState;
  assignments: {
    all: IAssignmentWithTags[];
    filteredAll: IAssignmentWithTags[];
    filteredNew: IAssignmentWithTags[];
    new: IAssignmentWithTags[];
  };
  filters: IFilterState;
  isLoadingAssignments: boolean;
  isScrapingAssignments: boolean;
}

export const initialState: IState = {
  activeFilters: { a11y: true, development: true, ux: true },
  assignments: { all: [], filteredAll: [], filteredNew: [], new: [] },
  filters: {
    a11y: ["a11y", "t12t", "accessibility", "tillgänglighet"],
    development: [
      "frontend",
      "front-end",
      "dev",
      "developer",
      "utvecklare",
      "backend",
      "back-end",
      "fullstack",
      "full-stack",
      "javascript",
      "typescript",
      "c#",
      ".net",
      "react",
      "software",
    ],
    ux: ["ux"],
  },
  isLoadingAssignments: false,
  isScrapingAssignments: false,
};
