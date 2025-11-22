import { JSONFilePreset } from "lowdb/node";

export async function loadFilters() {
  const filterDatabase = await JSONFilePreset<{ a11y: string[]; dev: string[]; ux: string[] }>(
    "./src/context/filters.json",
    { a11y: [], dev: [], ux: [] }
  );
  return filterDatabase.data;
}
