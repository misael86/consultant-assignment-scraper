import { useState } from "react";

import { Button } from "./button";
import { Header } from "./header";

interface IProperties {
  assignmentCount: number;
  children: React.ReactNode;
  title: string;
  toggle?: boolean;
  toggleAriaLabel?: string;
}

export function AssignmentList({ assignmentCount, children, title, toggle, toggleAriaLabel }: Readonly<IProperties>) {
  const [showList, setShowList] = useState(!toggle);

  return (
    <>
      <div className="flex gap-5 mt-10">
        <Header size={2}>
          {title} ({assignmentCount})
        </Header>
        {toggle && (
          <Button ariaLabel={toggleAriaLabel} onClick={() => setShowList(!showList)}>
            Toggle
          </Button>
        )}
      </div>
      {showList && <ul className="bt-10">{children}</ul>}
    </>
  );
}
