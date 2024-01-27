import { createNoStyleValueKeywordRule } from "../../utils/create-no-style-value-keyword-rule";

export default createNoStyleValueKeywordRule(
  /(\b|^)initial(\b|$)/,
  62.5,
  "https://www.caniemail.com/features/css-unit-initial/",
);
