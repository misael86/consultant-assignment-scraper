/* eslint-disable @typescript-eslint/no-misused-promises */
"use client";

import { StrictMode, useEffect } from "react";
import { useShallow } from "zustand/shallow";

import { AssignmentFilters } from "@/components/assignment-filters";
import { AssignmentItem } from "@/components/assignment-item";
import { AssignmentList } from "@/components/assignment-list";
import { Button } from "@/components/button";
import { Header } from "@/components/header";
import { useStore } from "@/context/store";

export default function Home() {
  const {
    activeFilters,
    assignments,
    isLoadingAssignments,
    isScrapingAssignments,
    loadStoredAssignments,
    newAssignments,
    scrapeAssignments,
  } = useStore(
    useShallow((state) => ({
      activeFilters: state.activeFilters,
      assignments: state.assignments,
      isLoadingAssignments: state.isLoadingAssignments,
      isScrapingAssignments: state.isScrapingAssignments,
      loadStoredAssignments: state.loadStoredAssignments,
      newAssignments: state.newAssignments,
      scrapeAssignments: state.scrapeAssignments,
    }))
  );

  useEffect(() => {
    void loadStoredAssignments();
  }, [loadStoredAssignments]);

  const filteredAssignments = assignments.filter((assignment) => {
    return (
      (!activeFilters.development && !activeFilters.a11y && !activeFilters.ux) ||
      (activeFilters.development && assignment.isDevelopment === true) ||
      (activeFilters.ux && assignment.isUX === true) ||
      (activeFilters.a11y && assignment.isA11y === true)
    );
  });

  return (
    <StrictMode>
      <main className="m-10 mt-5 mb-5">
        <Header size={1}>Consultant Assignment Scraper</Header>

        <div className="mt-2.5">
          <Button onClick={scrapeAssignments}>Scrape assignments</Button>
          {isScrapingAssignments && <span className="ml-5">Loading...</span>}
        </div>

        <AssignmentFilters />

        <AssignmentList assignmentCount={newAssignments.length} title="New assignments">
          {newAssignments.map((assignment) => {
            return <AssignmentItem assignment={assignment} key={assignment?.id ?? crypto.randomUUID()} />;
          })}
        </AssignmentList>

        <AssignmentList assignmentCount={filteredAssignments.length} title="Old assignments">
          {filteredAssignments.map((assignment) => {
            return <AssignmentItem assignment={assignment} key={assignment?.id ?? crypto.randomUUID()} />;
          })}
          {isLoadingAssignments && <li>Loading...</li>}
        </AssignmentList>
      </main>
    </StrictMode>
  );
}
