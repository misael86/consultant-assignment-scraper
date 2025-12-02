import { useShallow } from "zustand/shallow";

import { useStore } from "@/context/store";

import { Button } from "./button";
import { Header } from "./header";

export function AssignmentFilters() {
  const { activeFilters, assignments, clearActiveFilters, toggleActiveFilter } = useStore(
    useShallow((state) => ({
      activeFilters: state.activeFilters,
      assignments: state.assignments.all,
      clearActiveFilters: state.clearActiveFilters,
      toggleActiveFilter: state.toggleActiveFilter,
    }))
  );

  const toggleDevelopment = () => toggleActiveFilter("development");
  const toggleUx = () => toggleActiveFilter("ux");
  const toggleA11y = () => toggleActiveFilter("a11y");

  return (
    <div>
      <div className="mt-10">
        <Header size={2}>Filters</Header>
      </div>

      <div className="flex flex-row gap-5 items-center">
        <span>Type:</span>
        <div className="flex flex-row gap-5">
          <Button isActive={activeFilters.development} onClick={toggleDevelopment}>
            Development ({assignments?.filter((assignment) => assignment.isDevelopment).length})
          </Button>
          <Button isActive={activeFilters.ux} onClick={toggleUx}>
            User Experience ({assignments?.filter((assignment) => assignment.isUX).length})
          </Button>
          <Button isActive={activeFilters.a11y} onClick={toggleA11y}>
            Accessibility ({assignments?.filter((assignment) => assignment.isA11y).length})
          </Button>
          <Button onClick={clearActiveFilters}>Show all</Button>
        </div>
      </div>

      <div className="flex flex-row gap-5 items-center mt-5">
        <span>Source:</span>
        <div className="flex flex-row gap-5">
          {[...new Set(assignments?.map((assignment) => assignment.source))]
            .toSorted((a, b) => a.localeCompare(b))
            .map((source) => (
              <Button key={source}>
                {source} ({assignments?.filter((assignment) => assignment.source === source).length})
              </Button>
            ))}
          <Button>Show all</Button>
        </div>
      </div>
    </div>
  );
}
