"use client";

import { useState } from "react";

import { AssignmentFilters } from "@/components/assignment-filters";
import { AssignmentItem } from "@/components/assignment-item";
import { AssignmentList } from "@/components/assignment-list";
import { AssignmentTags } from "@/components/assignment-tags";
import { Header } from "@/components/header";
import { IAssignment } from "@/lib/scrape-response";

export function AssignmentScraper({ assignments }: Readonly<{ assignments: IAssignment[] }>) {
  const [filters, setFilters] = useState<string[]>([]);

  return (
    <main className="m-10 mt-5 mb-5">
      <Header size={1}>Consultant Assignment Scraper</Header>

      <AssignmentFilters assignments={assignments} filters={filters} setFilters={setFilters} />
      <AssignmentTags />

      <AssignmentList assignmentCount={assignments.length}>
        {assignments
          .filter((assignment) => {
            return filters.length === 0
              ? true
              : (filters.includes("dev") && assignment.isDev === true) ||
                  (filters.includes("ux") && assignment.isUX === true) ||
                  (filters.includes("a11y") && assignment.isA11y === true);
          })
          .map((assignment) => {
            return <AssignmentItem assignment={assignment} key={assignment.key} />;
          })}
      </AssignmentList>
    </main>
  );
}
