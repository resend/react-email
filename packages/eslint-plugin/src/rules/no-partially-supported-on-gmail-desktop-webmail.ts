import type { SupportEntry } from "../data/support-response";
import { withSupportPerVersion } from "../data/with-support-per-version";
import { createNoPartiallySupportedOn } from "../create-no-partially-supported-on";

export default (supportEntries: SupportEntry[]) => {
  return createNoPartiallySupportedOn(
    withSupportPerVersion(supportEntries, "gmail", "desktop-webmail"),
    "Gmail for the web",
  );
};
