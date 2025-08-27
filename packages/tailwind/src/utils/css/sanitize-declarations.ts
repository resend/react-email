import type { AtRule, Root, Rule } from 'postcss';

function oklchToRgb(l: number, c: number, h: number) {
  // Convert hue to radians
  const hRad = (h * Math.PI) / 180;

  // Convert OKLCH to OKLAB
  const a = c * Math.cos(hRad);
  const b = c * Math.sin(hRad);

  // Convert OKLAB to linear RGB
  const rLinear = +4.0767416621 * l - 3.3077115913 * a + 0.2309699292 * b;
  const gLinear = -1.2684380046 * l + 2.6097574011 * a - 0.3413193965 * b;
  const bLinear = -0.0041960863 * l - 0.7034186147 * a + 1.707614701 * b;

  // Convert linear RGB to sRGB
  const toSrgb = (channel: number) =>
    channel <= 0.0031308
      ? 12.92 * channel
      : 1.055 * channel ** (1 / 2.4) - 0.055;

  // Clamp values to [0, 1]
  const clamp = (value: number) => Math.max(0, Math.min(1, value));

  return {
    r: clamp(toSrgb(rLinear)),
    g: clamp(toSrgb(gLinear)),
    b: clamp(toSrgb(bLinear)),
  };
}

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
    const oklchParserRegex =
      /oklch\(\s*([\d.]+)(%)?\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.]+)(%)?)?\s*\)/g;

    declaration.value = declaration.value
      .replaceAll(rgbParserRegex, (_match, r, g, b, a) => {
        const alpha = a === '1' || !a ? '' : `,${a}`;
        return `rgb(${r},${g},${b}${alpha})`;
      })
      .replaceAll(
        oklchParserRegex,
        (_match, l, lPercentageSign: string, c, h, a, aPercentageSign) => {
          console.log(l, lPercentageSign, c, h, a, aPercentageSign);
          const rgb = oklchToRgb(
            lPercentageSign ? Number(l) / 100 : Number(l),
            Number(c),
            Number(h),
          );

          const alphaString = a ? `,${a}${aPercentageSign}` : '';
          return `rgb(${rgb.r},${rgb.g},${rgb.b}${alphaString})`;
        },
      );
  });
};
