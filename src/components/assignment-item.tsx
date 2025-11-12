interface IProperties {
  description: string;
  isA11y?: boolean;
  isDev?: boolean;
  isUX?: boolean;
  lastApplicationDate: string;
  scrappedDate: string;
  source: string;
  startDate: string;
  title: string;
}

export default function AssignmentItem({
  description,
  isA11y,
  isDev,
  isUX,
  lastApplicationDate,
  scrappedDate,
  source,
  startDate,
  title,
}: Readonly<IProperties>) {
  return (
    <li className="p-5 pt-2.5 pb-2.5 mt-2.5 mb-2.5 border-1 rounded-sm flex flex-column gap-5 justify-between">
      <div className="flex flex-col">
        <h3 className="font-bold">{title}</h3>
        <span>
          <DevelopmentLabel display={isDev} /> <UxLabel display={isUX} /> <A11yLabel display={isA11y} />
        </span>
        <span>{description}</span>
      </div>
      <div className="flex flex-col gap-2 border-l-2 border-dotted pl-5">
        <span>Start: {startDate}</span>
        <span>Apply before: {lastApplicationDate}</span>
        <span>Scrapped: {scrappedDate}</span>
        <span>Source: {source}</span>
      </div>
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
