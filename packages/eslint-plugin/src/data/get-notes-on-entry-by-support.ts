import type { SupportEntry } from "./support-response";

export const getNotesOnEntryBySupportValue = (
  support: string,
  entry: SupportEntry,
) => {
  const noteNumbers = support.match(/#(?<number>\d+)/g);
  if (noteNumbers !== null) {
    return Object.entries(entry.notes_by_num)
      .filter(([number]) => noteNumbers.includes(`#${number}`))
      .map(([_number, note]) => note);
  }
};
