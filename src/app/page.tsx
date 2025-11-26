/* eslint-disable @typescript-eslint/no-misused-promises */
"use client";

import { StrictMode } from "react";
import { useShallow } from "zustand/shallow";

import { AssignmentFilters } from "@/components/assignment-filters";
import { AssignmentItem } from "@/components/assignment-item";
import { AssignmentList } from "@/components/assignment-list";
import { Button } from "@/components/button";
import { Header } from "@/components/header";
import { useStore } from "@/context/store";

export default function Home() {
  const { activeFilters, assignments, isLoadingAssignments, scrapeAssignments } = useStore(
    useShallow((state) => ({
      activeFilters: state.activeFilters,
      assignments: state.assignments,
      isLoadingAssignments: state.isLoadingAssignments,
      scrapeAssignments: state.scrapeAssignments,
    }))
  );

  return (
    <StrictMode>
      <main className="m-10 mt-5 mb-5">
        <Header size={1}>Consultant Assignment Scraper</Header>
        <div className="mt-2.5">
          <Button onClick={scrapeAssignments}>Scrape assignments</Button>
          {isLoadingAssignments && <span className="ml-5">Loading...</span>}
        </div>

        <AssignmentFilters />

        {assignments && (
          <AssignmentList>
            {assignments
              .filter((assignment) => {
                return (
                  (!activeFilters.development || assignment.isDevelopment === true) &&
                  (!activeFilters.ux || assignment.isUX === true) &&
                  (!activeFilters.a11y || assignment.isA11y === true)
                );
              })
              .map((assignment) => {
                return <AssignmentItem assignment={assignment} key={assignment?.id ?? crypto.randomUUID()} />;
              })}
          </AssignmentList>
        )}
      </main>
    </StrictMode>
  );
}
