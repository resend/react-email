// importing the exact function used here will cause
// issues with esm because js-beautify is written with commonjs only

import * as jsBeautify from "js-beautify";
// Refactored the import of js-beautify to use the entire module due to compatibility issues with ESM.
// The js-beautify library is authored using CommonJS, and named imports may lead to problems when transpiling

const defaults = {
  unformatted: ["code", "pre", "em", "strong", "span"],
  indent_inner_html: true,
  indent_char: " ",
  indent_size: 2,
  sep: "\n",
};

export const pretty = (str: string, options = {}) => {
  return jsBeautify.html(str, { ...defaults, ...options });
};
