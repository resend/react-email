import type { SupportEntry } from "../data/support-response";
import { createNoUnsupportedOn } from "../create-no-unsupported-on";
import { withSupportPerVersion } from "../data/with-support-per-version";

export default (supportEntries: SupportEntry[]) => {
  return createNoUnsupportedOn(
    withSupportPerVersion(supportEntries, "orange", "desktop-webmail"),
    "Orange for Desktop Webmail",
  );
};
