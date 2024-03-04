import { createNoUnsupportedOn } from "../create-no-unsupported-on";
import type { SupportEntriesByCategory } from "../data/separate-entries-by-category";

export default (supportEntriesByCategory: SupportEntriesByCategory) => {
  return createNoUnsupportedOn(
    supportEntriesByCategory,
    "WEB.DE for iOS",
    "web-de",
    "ios",
  );
};
