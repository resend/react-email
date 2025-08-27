import type { AtRule, Root, Rule } from 'postcss';

const LAB_TO_LMS = {
  l: [0.3963377773761749, 0.2158037573099136],
  m: [-0.1055613458156586, -0.0638541728258133],
  s: [-0.0894841775298119, -1.2914855480194092],
};
const LSM_TO_RGB = {
  r: [4.0767416360759583, -3.3077115392580629, 0.2309699031821043],
  g: [-1.2684379732850315, 2.6097573492876882, -0.341319376002657],
  b: [-0.0041960761386756, -0.7034186179359362, 1.7076146940746117],
};

function lrgbToRgb(input: number) {
  const absoluteNumber = Math.abs(input);
  const sign = input < 0 ? -1 : 1;

  if (absoluteNumber > 0.0031308) {
    return sign * (absoluteNumber ** (1 / 2.4) * 1.055 - 0.055);
  }

  return input * 12.92;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function round(value: number, digits = 1) {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

function oklchToOklab(oklch: { l: number; c: number; h: number }) {
  return {
    l: oklch.l,
    a: oklch.c * Math.cos((oklch.h / 180) * Math.PI),
    b: oklch.c * Math.sin((oklch.h / 180) * Math.PI),
  };
}

/** Convert oklab to RGB */
function oklchToRgb(oklch: { l: number; c: number; h: number }) {
  const oklab = oklchToOklab(oklch);

  const l =
    (oklab.l + LAB_TO_LMS.l[0] * oklab.a + LAB_TO_LMS.l[1] * oklab.b) ** 3;
  const m =
    (oklab.l + LAB_TO_LMS.m[0] * oklab.a + LAB_TO_LMS.m[1] * oklab.b) ** 3;
  const s =
    (oklab.l + LAB_TO_LMS.s[0] * oklab.a + LAB_TO_LMS.s[1] * oklab.b) ** 3;

  const r =
    255 *
    lrgbToRgb(LSM_TO_RGB.r[0] * l + LSM_TO_RGB.r[1] * m + LSM_TO_RGB.r[2] * s);
  const g =
    255 *
    lrgbToRgb(LSM_TO_RGB.g[0] * l + LSM_TO_RGB.g[1] * m + LSM_TO_RGB.g[2] * s);
  const b =
    255 *
    lrgbToRgb(LSM_TO_RGB.b[0] * l + LSM_TO_RGB.b[1] * m + LSM_TO_RGB.b[2] * s);

  return {
    r: round(clamp(r, 0, 255)),
    g: round(clamp(g, 0, 255)),
    b: round(clamp(b, 0, 255)),
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
          const rgb = oklchToRgb({
            l: lPercentageSign ? Number(l) / 100 : Number(l),
            c: Number(c),
            h: Number(h),
          });

          const alphaString = a
            ? `,${aPercentageSign ? Number(a) / 100 : a}`
            : '';
          return `rgb(${rgb.r},${rgb.g},${rgb.b}${alphaString})`;
        },
      );
  });
};
