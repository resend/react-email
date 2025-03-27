import type { AtRule, Root, Rule } from 'postcss';

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
    const rgbParserRegex =
      /rgb\(\s*(\d+)\s*(\d+)\s*(\d+)(?:\s*\/\s*([\d%.]+))?\s*\)/g;

    declaration.value = declaration.value.replaceAll(
      rgbParserRegex,
      (_match, r, g, b, a) => {
        const alpha = a === '1' || typeof a === 'undefined' ? '' : `,${a}`;
        return `rgb(${r},${g},${b}${alpha})`;
      },
    );
  });
};
