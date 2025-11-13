interface IProperties {
  isA11y?: boolean;
  isDev?: boolean;
  isUX?: boolean;
  source: string;
  title: string;
  url: string;
}

export default function AssignmentItem({ isA11y, isDev, isUX, source, title, url }: Readonly<IProperties>) {
  return (
    <li>
      <a
        className="p-5 pt-2.5 pb-2.5 mt-2.5 mb-2.5 border-1 rounded-sm flex flex-column gap-5 justify-between cursor-pointer hover:outline-2 hover:outline-yellow-100 hover:outline-offset-2 transition-all duration-200"
        href={url}
      >
        <div className="flex flex-col">
          <h3 className="font-bold">{title}</h3>
          <small>
            <DevelopmentLabel display={isDev} /> <UxLabel display={isUX} /> <A11yLabel display={isA11y} />
          </small>
        </div>
        <div className="flex flex-col gap-2 border-l-2 border-dotted pl-5">
          <span>Source: {source}</span>
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
