import { isA11y } from "@/lib/filters/is-a11y";
import { isDevelopment } from "@/lib/filters/is-development";
import { isUX } from "@/lib/filters/is-ux";
import { IAssignment } from "@/lib/scrape-response";

interface IProperties {
  assignment: IAssignment;
}

export function AssignmentItem({ assignment }: Readonly<IProperties>) {
  return (
    <li>
      <a
        className="p-5 pt-2.5 pb-2.5 mt-2.5 mb-2.5 border-1 rounded-sm flex flex-column gap-5 justify-between cursor-pointer hover:outline-2 hover:outline-yellow-100 hover:outline-offset-2 transition-all duration-200"
        href={assignment.url}
      >
        <div className="flex flex-row gap-5">
          <h3 className="font-bold">{assignment.title}</h3>
          <span>
            <DevelopmentLabel display={isDevelopment(assignment)} /> <UxLabel display={isUX(assignment)} />{" "}
            <A11yLabel display={isA11y(assignment)} />
          </span>
        </div>
        <div className="flex">
          <div className="border-l-2 border-dotted pl-5 pr-5">
            <span>{assignment.source}</span>
          </div>
          <div className="border-l-2 border-dotted pl-5 pr-5">
            <span>{assignment.scraped}</span>
          </div>
          <div className="border-l-2 border-dotted pl-5">
            <span>Status</span>
          </div>
        </div>
      </a>
    </li>
  );
}

function A11yLabel({ display }: { display?: boolean }) {
  return display ? <span className="text-orange-300 italic">[ a11y ]</span> : undefined;
}

function DevelopmentLabel({ display }: { display?: boolean }) {
  return display ? <span className="text-green-300 italic">[ dev ]</span> : undefined;
}

function UxLabel({ display }: { display?: boolean }) {
  return display ? <span className="text-blue-300 italic">[ ux ]</span> : undefined;
}
