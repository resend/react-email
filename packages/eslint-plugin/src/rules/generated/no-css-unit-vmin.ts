import { createNoStyleValueKeywordRule } from "../../utils/create-no-style-value-keyword-rule";

export default createNoStyleValueKeywordRule(
  /[0-9]+vmin/,
  62.5,
  "https://www.caniemail.com/features/css-unit-vmin/",
);
