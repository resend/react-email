import type { SupportEntryWithVersionsInArray } from "../create-no-unsupported-on";
import type { EmailClient, Platform, SupportEntry } from "./support-response";

export function withSupportPerVersion(
  supportEntries: SupportEntry[],
  emailClient: EmailClient,
  platform: Platform,
): SupportEntryWithVersionsInArray[] {
  return supportEntries.map((entry) => ({
    ...entry,
    supportPerVersion: entry.stats[emailClient]?.[platform]
      ? Object.entries(entry.stats[emailClient]![platform]!).map(
          ([version, support]) => ({
            version,
            support,
          }),
        )
      : [],
  }));
}
