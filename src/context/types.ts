import { IAssignment } from "@/lib/scrape-response";

export interface IActions {
  addAssignments: (assignments: IAssignment[]) => void;
  clearActiveFilters: () => void;
  setAssignments: (assignments: IAssignment[]) => void;
  setFilters: (filters: IFilterState) => void;
  toggleActiveFilter: (filter: keyof IFilterState) => void;
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
  activeFilters: { a11y: boolean; development: boolean; ux: boolean };
  assignments?: IAssignmentWithTags[];
  filters?: IFilterState;
}

export type IStore = IActions & IState;

export type IStoreSet = (function_: (state: IStore) => Partial<IStore>) => void;
