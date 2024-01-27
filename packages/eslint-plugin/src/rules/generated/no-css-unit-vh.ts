import { createNoStyleValueKeywordRule } from "../../utils/create-no-style-value-keyword-rule";

export default createNoStyleValueKeywordRule(
  /[0-9]+vh/,
  72,
  "https://www.caniemail.com/features/css-unit-vh/",
);
