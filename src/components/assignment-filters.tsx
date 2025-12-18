import { useShallow } from "zustand/shallow";

import { useStore } from "@/context/store";

import { Button } from "./button";
import { Header } from "./header";

export function AssignmentFilters() {
  const { activeFilters, assignments, clearActiveFilters, toggleActiveFilter } = useStore(
    useShallow((state) => ({
      activeFilters: state.activeFilters,
      assignments: state.assignments.new,
      clearActiveFilters: state.clearActiveFilters,
      toggleActiveFilter: state.toggleActiveFilter,
    }))
  );

  const toggleDevelopment = () => toggleActiveFilter("development");
  const toggleUx = () => toggleActiveFilter("ux");
  const toggleA11y = () => toggleActiveFilter("a11y");

  const sources = [...new Set(assignments?.map((assignment) => assignment.source))].toSorted((a, b) =>
    a.localeCompare(b)
  );

  return (
    <div>
      <div className="mt-10">
        <Header size={2}>Filter assignment type</Header>
      </div>

      <div className="flex flex-row flex-wrap gap-5 items-center mt-2.5 mb-10">
        <Button isActive={activeFilters.development} onClick={toggleDevelopment}>
          Development ({assignments?.filter((assignment) => assignment.isDevelopment).length})
        </Button>
        <Button isActive={activeFilters.ux} onClick={toggleUx}>
          User Experience ({assignments?.filter((assignment) => assignment.isUX).length})
        </Button>
        <Button isActive={activeFilters.a11y} onClick={toggleA11y}>
          Accessibility ({assignments?.filter((assignment) => assignment.isA11y).length})
        </Button>
        <Button onClick={clearActiveFilters}>Clear filters</Button>
      </div>

      <Header size={2}>Assignment sources ({sources.length})</Header>
      <div className="flex flex-row flex-wrap gap-5">
        {sources.map((source) => (
          <span key={source}>
            {source} ({assignments?.filter((assignment) => assignment.source === source).length})
          </span>
        ))}
      </div>
    </div>
  );
}
