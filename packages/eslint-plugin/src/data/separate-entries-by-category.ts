import { SupportEntry, SupportEntryCategroy } from "./support-response";

export type SupportEntriesByCategory = Record<SupportEntryCategroy, SupportEntry[]>;

export const separateEntriesByCategory = (entries: SupportEntry[]): SupportEntriesByCategory => {
  const result: SupportEntriesByCategory = {
    css: [],
    html: [],
    image: [],
    others: [],
  };

  for (const entry of entries) {
    result[entry.category].push(entry);
  }

  return result;
}
