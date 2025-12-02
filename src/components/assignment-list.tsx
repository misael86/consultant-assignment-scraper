import { Header } from "./header";

interface IProperties {
  assignmentCount: number;
  children: React.ReactNode;
  title: string;
}

export function AssignmentList({ assignmentCount, children, title }: Readonly<IProperties>) {
  return (
    <>
      <div className="mt-10">
        <Header size={2}>
          {title} ({assignmentCount})
        </Header>
      </div>
      <ul className="bt-10">{children}</ul>
    </>
  );
}
