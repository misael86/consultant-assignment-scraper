import { useCallback } from "react";

import { IAssignment } from "@/lib/scrape-response";

import { Button } from "./button";
import { Header } from "./header";

interface IProperties {
  assignments: IAssignment[];
  filters: string[];
  setFilters: (filters: string[]) => void;
}

export function AssignmentFilters({ assignments, filters, setFilters }: Readonly<IProperties>) {
  const handleFilter = useCallback(
    (filter: string) => {
      if (filters.includes(filter)) {
        setFilters(filters.filter((f) => f !== filter));
      } else if (filter === "") {
        setFilters([]);
      } else {
        setFilters([...filters, filter]);
      }
    },
    [filters, setFilters]
  );

  return (
    <div>
      <div className="mt-10">
        <Header size={2}>Filters</Header>
      </div>

      <div className="flex flex-row gap-5 items-center">
        <span>Type:</span>
        <div className="flex flex-row gap-5">
          <Button isActive={filters.includes("dev")} onClick={() => handleFilter("dev")}>
            Dev ({assignments.filter((assignment) => assignment.isDev).length})
          </Button>
          <Button isActive={filters.includes("ux")} onClick={() => handleFilter("ux")}>
            UX ({assignments.filter((assignment) => assignment.isUX).length})
          </Button>
          <Button isActive={filters.includes("a11y")} onClick={() => handleFilter("a11y")}>
            A11y ({assignments.filter((assignment) => assignment.isA11y).length})
          </Button>
          <Button onClick={() => handleFilter("")}>Show all</Button>
        </div>
      </div>
    </div>
  );
}
