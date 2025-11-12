interface IProperties {
  children: React.ReactNode;
}

export default function Button({ children }: Readonly<IProperties>) {
  return <button className="border-1 rounded-lg p-2 pt-1 pb-1 cursor-pointer">{children}</button>;
}
