import { IAssignment } from "@shared/assignment";

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
  hasScrapedNrAssignments: number;
  isLoadingAssignments: boolean;
  isScrapingAssignments: boolean;
  isScrapingNrAssignments: number;
}

export const initialState: IState = {
  activeFilters: { a11y: true, development: true, ux: true },
  assignments: { all: [], filteredAll: [], filteredNew: [], new: [] },
  filters: {
    a11y: ["a11y", "t12t", "accessibility", "tillgänglighet", "wcag"],
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
      "programmer",
      "programmerare",
    ],
    ux: ["ux"],
  },
  hasScrapedNrAssignments: 0,
  isLoadingAssignments: false,
  isScrapingAssignments: false,
  isScrapingNrAssignments: 0,
};
