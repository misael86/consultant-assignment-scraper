import filters from "@/context/filters.json";

import { Header } from "./header";

export function AssignmentTags() {
  return (
    <>
      <div className="mt-10">
        <Header size={2}>Tags</Header>
      </div>

      <div className="flex flex-row gap-5">
        <span>Dev:</span>
        {filters.dev.map((filter) => {
          return <span key={filter}>{filter}</span>;
        })}
      </div>

      <div className="mt-1 flex flex-row gap-5">
        <span>UX:</span>
        {filters.ux.map((filter) => {
          return <span key={filter}>{filter}</span>;
        })}
      </div>

      <div className="mt-1 flex flex-row gap-5">
        <span>A11y:</span>
        {filters.a11y.map((filter) => {
          return <span key={filter}>{filter}</span>;
        })}
      </div>
    </>
  );
}
