import AssignmentItem from "@/components/assignment-item";
import AssignmentList from "@/components/assignment-list";
import Button from "@/components/button";
import Header from "@/components/header";
// import { IAssignment } from "@/lib/scraper-response";
import { scrapeVerama } from "@/lib/verama-scraper";

export default async function Home() {
  const veramaAssignments = await scrapeVerama();
  // const veramaAssignments: IAssignment[] = [{ source: "test", title: "test", url: "" }];

  return (
    <main className="m-10 mt-5 mb-5">
      <Header size={1}>Consultant Assignment Scraper</Header>

      <div className="mt-5">
        <Header size={2}>Available assignments (X)</Header>
      </div>

      <div className="mt-10 flex flex-row gap-5 items-center">
        <span>Type:</span>
        <div className="flex flex-row gap-5">
          <Button>Dev (X)</Button>
          <Button>UX (X)</Button>
          <Button>A11y (X)</Button>
          <Button>Clear all</Button>
        </div>
      </div>

      <div className="mt-5 mb-10 flex flex-row gap-5 items-center">
        <span>Source:</span>
        <div className="flex flex-row gap-5">
          <Button>Verama ({veramaAssignments.length})</Button>
          <Button>Cinode (X)</Button>
          <Button>Clear all</Button>
        </div>
      </div>

      <AssignmentList>
        {veramaAssignments.map((assignment) => {
          return (
            <AssignmentItem
              key={assignment.url}
              source={assignment.source}
              title={assignment.title ?? "N/A"}
              url={assignment.url ?? ""}
            />
          );
        })}
      </AssignmentList>

      <div className="mt-10">
        <Header size={2}>Filters</Header>
      </div>

      <div className="mt-5 mb-5 flex flex-row gap-5">
        <span className="mt-1">Dev:</span>
        <div className="flex flex-row flex-wrap gap-5">
          <Button>Froentend</Button>
          <Button>Dev</Button>
          <Button>Developer</Button>
          <Button>Backend</Button>
          <Button>Utvecklare</Button>
          <Button>Fullstack</Button>
          <Button>JavaScript</Button>
          <Button>TypeScript</Button>
          <Button>C#</Button>
          <Button>React</Button>
          <Button>.Net</Button>
          <Button>+</Button>
        </div>
      </div>

      <div className="mt-5 flex flex-row gap-5">
        <span className="mt-1">UX:</span>
        <div className="flex flex-row flex-wrap gap-5">
          <Button>UX</Button>
          <Button>+</Button>
        </div>
      </div>

      <div className="mt-5 mb-20 flex flex-row gap-5">
        <span className="mt-1">A11y:</span>
        <div className="flex flex-row flex-wrap gap-5">
          <Button>A11y</Button>
          <Button>T12t</Button>
          <Button>Accessibility</Button>
          <Button>Tillgänglighet</Button>
          <Button>+</Button>
        </div>
      </div>
    </main>
  );
}
