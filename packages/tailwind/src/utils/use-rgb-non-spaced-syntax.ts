/**
 * This is to avoid problems on email clients that don't allow for spaced syntax on
 * rgb.
 *
 * See https://www.caniemail.com/features/css-rgb/
 */
export const useRgbNonSpacedSyntax = (css: string) => {
  // Thanks tw-to-css!
  // from https://github.com/vinicoder/tw-to-css/blob/main/src/util/format-css.ts
  const regex = /rgb\(\s*(\d+)\s*(\d+)\s*(\d+)(?:\s*\/\s*([\d%.]+))?\s*\)/gm;

  return css.replaceAll(regex, (_match, r, g, b, a) => {
    const alpha = a === "1" || typeof a === "undefined" ? "" : `,${a}`;
    return `rgb(${r},${g},${b}${alpha})`;
  });
};
