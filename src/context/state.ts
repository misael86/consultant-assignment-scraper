import assignments from "@/context/assignments.json";
import filters from "@/context/filters.json";
import { IAssignment } from "@/lib/scrape-response";

import { sortAssignments, tagAssignments } from "./libs";

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
}

export function getInitialState(): IState {
  return {
    activeFilters: { a11y: true, development: true, ux: true },
    assignments: sortAssignments(tagAssignments(assignments, filters)),
    filters,
    isLoadingAssignments: false,
  };
}
