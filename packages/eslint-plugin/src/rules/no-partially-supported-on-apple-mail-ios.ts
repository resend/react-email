import { createNoPartiallySupportedOn } from "../create-no-partially-supported-on";
import type { SupportEntriesByCategory } from "../data/separate-entries-by-category";

export default (supportEntriesByCategory: SupportEntriesByCategory) => {
  return createNoPartiallySupportedOn(
    supportEntriesByCategory,
    "Apple Mail for iOS",
    "apple-mail",
    "ios",
  );
};
