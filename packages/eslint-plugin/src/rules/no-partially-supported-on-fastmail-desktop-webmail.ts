import type { SupportEntry } from "../data/support-response";
import { createNoPartiallySupportedOn } from "../create-no-partially-supported-on";
import { withSupportPerVersion } from "../data/with-support-per-version";

export default (supportEntries: SupportEntry[]) => {
  return createNoPartiallySupportedOn(
    withSupportPerVersion(supportEntries, "fastmail", "desktop-webmail"),
    "Fastmail for Desktop Webmail",
  );
};