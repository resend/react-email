import { html } from "js-beautify";

const defaults = {
  unformatted: ["code", "pre", "em", "strong", "span"],
  indent_inner_html: true,
  indent_char: " ",
  indent_size: 2,
  sep: "\n",
};

export const pretty = (str: string, options = {}) => {
  return html(str, { ...defaults, ...options });
};
