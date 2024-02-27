// importing the exact function used here will cause
// issues with esm because js-beautify is written with commonjs only
import jsBeautify from "js-beautify";

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
