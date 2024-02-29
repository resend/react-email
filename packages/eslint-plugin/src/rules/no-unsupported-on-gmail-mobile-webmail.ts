import type { SupportEntry } from "../data/support-response";
import { createNoUnsupportedOn } from "../create-no-unsupported-on";
import { withSupportPerVersion } from "../data/with-support-per-version";

export default (supportEntries: SupportEntry[]) => {
  return createNoUnsupportedOn(
    withSupportPerVersion(supportEntries, "gmail", "mobile-webmail"),
    "Gmail for Mobile Webmail",
  );
};
