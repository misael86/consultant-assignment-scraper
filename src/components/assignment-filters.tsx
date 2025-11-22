import { useStore } from "@/context/store";

import { Button } from "./button";
import { Header } from "./header";

export function AssignmentFilters() {
  const { activeFilters, assignments, clearActiveFilters, toggleActiveFilter } = useStore((state) => ({
    activeFilters: state.activeFilters,
    assignments: state.assignments,
    clearActiveFilters: state.clearActiveFilters,
    toggleActiveFilter: state.toggleActiveFilter,
  }));

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
    </div>
  );
}
