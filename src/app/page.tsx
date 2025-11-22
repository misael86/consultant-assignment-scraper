import { AssignmentFilters } from "@/components/assignment-filters";
import { AssignmentItem } from "@/components/assignment-item";
import { AssignmentList } from "@/components/assignment-list";
import { AssignmentTags } from "@/components/assignment-tags";
import { Button } from "@/components/button";
import { Header } from "@/components/header";
import { useStore } from "@/context/store";

export function Home() {
  const { activeFilters, assignments } = useStore((state) => ({
    activeFilters: state.activeFilters,
    assignments: state.assignments,
  }));

  return (
    <main className="m-10 mt-5 mb-5">
      <Header size={1}>Consultant Assignment Scraper</Header>
      <Button>Scrape assignments</Button>

      <AssignmentFilters />
      <AssignmentTags />

      {assignments && (
        <AssignmentList assignmentCount={assignments.length}>
          {assignments
            .filter((assignment) => {
              return (
                (activeFilters.development && assignment.isDevelopment === true) ||
                (activeFilters.ux && assignment.isUX === true) ||
                (activeFilters.a11y && assignment.isA11y === true)
              );
            })
            .map((assignment) => {
              return <AssignmentItem assignment={assignment} key={assignment?.id ?? crypto.randomUUID()} />;
            })}
        </AssignmentList>
      )}
    </main>
  );
}
