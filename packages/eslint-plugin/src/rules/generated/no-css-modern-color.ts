import { createNoStyleValueKeywordRule } from "../../utils/create-no-style-value-keyword-rule";

export default createNoStyleValueKeywordRule(
  [/[0-9]+lch/, /[0-9]+oklch/, /[0-9]+lab/, /[0-9]+oklab/],
  27.027027027027028,
  "https://www.caniemail.com/features/css-modern-color/",
);
