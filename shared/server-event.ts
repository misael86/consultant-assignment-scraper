import { IAssignment } from "./assignment";

export type ScrapeAssignmentsEventResponse = { 
  type: "scraping_started", 
  totalScrapers: number 
} | {
  type: "scraping_completed";
} | {
  type: "new_assignments";
  assignments: IAssignment[];
} | {
  type: "error";
  message: string;
};

export type ScrapeAssignmentsEventRequest = { type: "start_scrape" };