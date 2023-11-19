import { createNoStyleValueKeywordRule } from "../utils/create-no-style-value-keyword-rule";

export default createNoStyleValueKeywordRule(
  ['ich(', 'oklch(', 'lab(', 'oklab('], 
  10.81081081081081, 
  'https://www.caniemail.com/features/css-modern-color/'
);
