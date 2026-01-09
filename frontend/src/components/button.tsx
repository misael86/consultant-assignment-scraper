import { MouseEventHandler } from "react";

interface IProperties {
  ariaLabel?: string;
  children: React.ReactNode;
  isActive?: boolean;
  isBig?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

export function Button({ ariaLabel, children, isActive, isBig, onClick }: Readonly<IProperties>) {
  let style =
    "border-1 rounded-lg cursor-pointer focus-visible:outline-2 hover:outline-2 focus-visible:outline-yellow-100 hover:outline-yellow-100 focus-visible:outline-offset-2 hover:outline-offset-2 transition-all duration-200";
  if (isActive) style += " bg-yellow-100 text-black";
  if (isBig) style += " text-3xl p-5";
  if (!isBig) style += " p-2 pt-1 pb-1";
  return (
    <button aria-label={ariaLabel} className={style} onClick={onClick}>
      {children}
    </button>
  );
}
