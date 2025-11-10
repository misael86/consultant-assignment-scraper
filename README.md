# Consultant Assignment Scraper

## Background

I am a consultant and when I was trying to find a new assingment I found Anna Leijon's blogpost listing a bunch of consultant brokers and portals where assignments are listed. I found myself having a browser window with about 40 tabs that I had to check every day to see if there were any assignments that would fit me. So I got bored of searching for assignments, and as every good developer, I decided to code my way out of my problem ;) I decided to create a service that scrapes the portals and list them in a unison way, making it possible to filter for keywords that I know are interesting for me or my wife that is a UX designer and also sometimes interested in knowing what type of assignments are out there.

## Stack

I've decided to write the solution in Nextjs and TypeScript. In that way practicing server rendering and also React Server Components. The database is stored localy, therefor, as for now, this page can only be run localy. I don't see the point of hosting this somewhere yet. I am also going to experiment with Gemini CLI and see if I can get some help writing documentation, getting code reviewed and having a coding partner who can guide me in the right direction, without writing the code for me. So I want to stay away from vibe coding the project.

## Running the code

Running the code is straight forward. I've used PNPM for package managing.

Install all the dependencies the first time

- `pnpm install`

And then just run the local server

- `pnpm dev`

And visit the localhost url

- [http://localhost:3000](http://localhost:3000)

## Folder structure

Normally in nextjs projects you have one app folder in root and then have all the code there. But I am used to having one src folder containing all the code and in there separate the code into specific folders.

- app: nextjs routes and apis
- components: shared components
- context: state management
- hooks: custom hooks
- lib: shared functions
- prisma: database files
- styles: global CSS
- tests: e2e tests
