import { createNoStyleValueKeywordRule } from "../../utils/create-no-style-value-keyword-rule";

export default createNoStyleValueKeywordRule(
  /[0-9]+rem/,
  66.66666666666666,
  "https://www.caniemail.com/features/css-unit-rem/",
);
