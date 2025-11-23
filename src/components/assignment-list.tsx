import { useShallow } from "zustand/shallow";

import { useStore } from "@/context/store";

import { Header } from "./header";

interface IProperties {
  children: React.ReactNode;
}

export function AssignmentList({ children }: Readonly<IProperties>) {
  const { assignmentsCount } = useStore(
    useShallow((state) => ({
      assignmentsCount: state.assignments?.length,
    }))
  );

  return (
    <>
      <div className="mt-10">
        <Header size={2}>Available assignments ({assignmentsCount})</Header>
      </div>
      <ul className="bt-10">{children}</ul>
    </>
  );
}
