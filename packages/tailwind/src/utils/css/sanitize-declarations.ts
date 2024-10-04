import type { AtRule, Root, Rule } from "postcss";

const rgbParserRegex = /rgb\(\s*(\d+)\s*(\d+)\s*(\d+)(?:\s*\/\s*([\d%.]+))?\s*\)/g;

/**
 * Meant to do all the things necessary, in a per-declaration basis, to have the best email client
 * support possible.
 *
 * Currently it only converts all `rgb` declaration values that use a space-based syntax
 * into a command based one since the space-based isn't well supported.
 */
export const sanitizeDeclarations = (
  nodeContainingDeclarations: Rule | AtRule | Root,
) => {
  nodeContainingDeclarations.walkDecls((declaration) => {
    declaration.value = declaration.value.replaceAll(
      rgbParserRegex,
      (_match, r, g, b, a) => {
        const alpha = a === "1" || typeof a === "undefined" ? "" : `,${a}`;
        return `rgb(${r},${g},${b}${alpha})`;
      },
    );

    /*
      We reset the regex's last index so that the state of the last time it ran doesn't intefere
      with when it is used another time
    */
    rgbParserRegex.lastIndex = 0;
  });
};
