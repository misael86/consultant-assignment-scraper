interface IProperties {
  children: React.ReactNode;
}

export default function AssignmentList({ children }: Readonly<IProperties>) {
  return <ul>{children}</ul>;
}
