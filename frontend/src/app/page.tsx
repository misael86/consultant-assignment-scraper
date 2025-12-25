"use client";

import { AssignmentFilters } from "@frontend/components/assignment-filters";
import { AssignmentItem } from "@frontend/components/assignment-item";
import { AssignmentList } from "@frontend/components/assignment-list";
import { Button } from "@frontend/components/button";
import { Header } from "@frontend/components/header";
import { useStore } from "@frontend/context/store";
import { StrictMode, useEffect } from "react";
import { useShallow } from "zustand/shallow";

export default function Home() {
  const {
    filteredAssignmentsAll,
    filteredAssignmentsNew,
    isLoadingAssignments,
    isScrapingAssignments,
    loadStoredAssignments,
    scrapeAssignments,
  } = useStore(
    useShallow((state) => ({
      filteredAssignmentsAll: state.assignments.filteredAll,
      filteredAssignmentsNew: state.assignments.filteredNew,
      isLoadingAssignments: state.isLoadingAssignments,
      isScrapingAssignments: state.isScrapingAssignments,
      loadStoredAssignments: state.loadStoredAssignments,
      scrapeAssignments: state.scrapeAssignments,
    }))
  );

  useEffect(() => {
    void loadStoredAssignments();
  }, [loadStoredAssignments]);

  return (
    <StrictMode>
      <main className="m-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <Header size={1}>Consultant Assignment Scraper</Header>
          </div>

          <div className="mt-2.5 text-center">
            <Button onClick={scrapeAssignments}>Scrape assignments</Button>
            {isScrapingAssignments && <span className="ml-5">Loading...</span>}
          </div>

          <AssignmentFilters />

          <AssignmentList assignmentCount={filteredAssignmentsNew.length} title="Scraped assignments">
            {filteredAssignmentsNew.map((assignment) => {
              return <AssignmentItem assignment={assignment} key={`${assignment.source}-${assignment.id}`} />;
            })}
          </AssignmentList>

          <AssignmentList
            assignmentCount={filteredAssignmentsAll.length}
            title="Previously scraped assignments"
            toggle
            toggleAriaLabel="Toggle display old assignments"
          >
            {filteredAssignmentsAll.map((assignment) => {
              return <AssignmentItem assignment={assignment} key={`${assignment.source}-${assignment.id}`} />;
            })}
            {isLoadingAssignments && <li>Loading...</li>}
          </AssignmentList>
        </div>
      </main>
    </StrictMode>
  );
}
