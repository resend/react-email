import { createNoPartiallySupportedOn } from "../create-no-partially-supported-on";
import type { SupportEntriesByCategory } from "../data/separate-entries-by-category";

export default (supportEntriesByCategory: SupportEntriesByCategory) => {
  return createNoPartiallySupportedOn(
    supportEntriesByCategory,
    "1&1 for Desktop Webmail",
    "ionos-1and1",
    "desktop-webmail",
  );
};
