import { IAssignmentWithTags } from "@/context/state";

interface IProperties {
  assignment: IAssignmentWithTags;
}

export function AssignmentItem({ assignment }: Readonly<IProperties>) {
  return (
    <li>
      <a
        className="p-5 pt-2.5 pb-2.5 mt-2.5 mb-2.5 border-1 rounded-sm flex flex-column flex-wrap gap-5 justify-between cursor-pointer focus-visible:outline-2 hover:outline-2 focus-visible:outline-yellow-100 hover:outline-yellow-100 focus-visible:outline-offset-2 hover:outline-offset-2 transition-all duration-200"
        href={assignment.url}
        rel="noreferrer"
        target="_blank"
      >
        <div className="flex flex-row gap-5">
          <h3 className="font-bold">{assignment.title}</h3>
        </div>
        <div className="flex flex-wrap">
          <span className="pr-5">
            <DevelopmentLabel display={assignment.isDevelopment} /> <UxLabel display={assignment.isUX} />
            <A11yLabel display={assignment.isA11y} />
          </span>
          <div className="border-l-2 border-dotted pl-5 pr-5">
            <span>{assignment.source}</span>
          </div>
          <div className="border-l-2 border-dotted pl-5">
            <span>{assignment.scraped}</span>
          </div>
        </div>
      </a>
    </li>
  );
}

function A11yLabel({ display }: { display?: boolean }) {
  return display ? <span className="text-orange-300">[ a11y ]</span> : undefined;
}

function DevelopmentLabel({ display }: { display?: boolean }) {
  return display ? <span className="text-green-300">[ dev ]</span> : undefined;
}

function UxLabel({ display }: { display?: boolean }) {
  return display ? <span className="text-blue-300">[ ux ]</span> : undefined;
}
