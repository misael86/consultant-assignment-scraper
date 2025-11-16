import { MouseEventHandler } from "react";

interface IProperties {
  children: React.ReactNode;
  isActive?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

export function Button({ children, isActive, onClick }: Readonly<IProperties>) {
  let style = "border-1 rounded-lg p-2 pt-1 pb-1 cursor-pointer";
  if (isActive) style += " bg-yellow-100 text-black";
  return (
    <button className={style} onClick={onClick}>
      {children}
    </button>
  );
}
