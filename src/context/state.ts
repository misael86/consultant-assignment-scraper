import { IAssignment } from "@/lib/scrape-response";

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
  activeFilters: { a11y: boolean; development: boolean; ux: boolean };
  assignments: IAssignmentWithTags[];
  filters: IFilterState;
  isLoadingAssignments: boolean;
  isScrapingAssignments: boolean;
  newAssignments: IAssignment[];
}

export const initialState: IState = {
  activeFilters: { a11y: true, development: true, ux: true },
  assignments: [],
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
  newAssignments: [],
};
