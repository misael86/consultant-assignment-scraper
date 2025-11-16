import { Header } from "./header";

interface IProperties {
  assignmentCount: number;
  children: React.ReactNode;
}

export function AssignmentList({ assignmentCount, children }: Readonly<IProperties>) {
  return (
    <>
      <div className="mt-10">
        <Header size={2}>Available assignments ({assignmentCount})</Header>
      </div>
      <ul className="bt-10">{children}</ul>
    </>
  );
}
