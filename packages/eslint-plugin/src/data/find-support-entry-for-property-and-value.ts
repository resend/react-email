import type { SupportEntry } from "./support-response";

export const findSupportEntryForPropertyAndValue = <Entry extends SupportEntry>(
  entries: Entry[],
  name: string,
  value: string,
) => {
  return entries.find((e) => {
    const match =
      /(?<propertyName>[a-z-]+)\s*:\s*(?<propertyValue>[a-zA-Z\-0-9()+*/_ ]+)/.exec(
        e.title.trim(),
      );
    if (match) {
      const [_full, entryName, entryValue] = match;

      return name === entryName && value === entryValue;
    }

    return false;
  });
};
