import {
  type CssNode,
  type Declaration,
  generate,
  List,
  parse,
  type Value,
  walk,
} from 'css-tree';

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

function separteShorthandDeclaration(
  shorthandToReplace: Declaration,
  [start, end]: [string, string],
): Declaration {
  shorthandToReplace.property = start;

  const values =
    shorthandToReplace.value.type === 'Value'
      ? shorthandToReplace.value.children
          .toArray()
          .filter(
            (child) =>
              child.type === 'Dimension' ||
              child.type === 'Number' ||
              child.type === 'Percentage',
          )
      : [shorthandToReplace.value];
  let endValue = shorthandToReplace.value;
  if (values.length === 2) {
    endValue = {
      type: 'Value',
      children: new List<CssNode>().fromArray([values[1]]),
    };
    shorthandToReplace.value = {
      type: 'Value',
      children: new List<CssNode>().fromArray([values[0]]),
    };
  }

  return {
    type: 'Declaration',
    property: end,
    value: endValue,
    important: shorthandToReplace.important,
  };
}

/**
 * Meant to do all the things necessary, in a per-declaration basis, to have the best email client
 * support possible.
 *
 * Here's the transformations it does so far:
 * - convert all `rgb` with space-based syntax into a comma based one;
 * - convert all `oklch` values into `rgb`;
 * - convert all hex values into `rgb`;
 * - convert `padding-inline` into `padding-left` and `padding-right`;
 * - convert `padding-block` into `padding-top` and `padding-bottom`;
 * - convert `margin-inline` into `margin-left` and `margin-right`;
 * - convert `margin-block` into `margin-top` and `margin-bottom`.
 */
export function sanitizeDeclarations(nodeContainingDeclarations: CssNode) {
  walk(nodeContainingDeclarations, {
    visit: 'Declaration',
    enter(declaration, item, list) {
      if (generate(declaration) === 'border-radius:calc(Infinity*1px)') {
        declaration.value = parse('9999px', { context: 'value' }) as Value;
      }
      walk(declaration, {
        visit: 'Function',
        enter(func, funcParentListItem) {
          const children = func.children.toArray();
          if (func.name === 'oklch') {
            let l: number | undefined;
            let c: number | undefined;
            let h: number | undefined;
            let a: number | undefined;
            for (const child of children) {
              if (child.type === 'Number') {
                if (l === undefined) {
                  l = Number.parseFloat(child.value);
                  continue;
                }
                if (c === undefined) {
                  c = Number.parseFloat(child.value);
                  continue;
                }
                if (h === undefined) {
                  h = Number.parseFloat(child.value);
                  continue;
                }
                if (a === undefined) {
                  a = Number.parseFloat(child.value);
                  continue;
                }
              }
              if (child.type === 'Dimension' && child.unit === 'deg') {
                if (h === undefined) {
                  h = Number.parseFloat(child.value);
                  continue;
                }
              }
              if (child.type === 'Percentage') {
                if (l === undefined) {
                  l = Number.parseFloat(child.value) / 100;
                  continue;
                }
                if (a === undefined) {
                  a = Number.parseFloat(child.value) / 100;
                }
              }
            }

            if (l === undefined || c === undefined || h === undefined) {
              throw new Error(
                'Could not determine the parameters of an oklch() function.',
                {
                  cause: declaration,
                },
              );
            }

            const rgb = oklchToRgb({
              l,
              c,
              h,
            });

            const alphaString = a !== undefined ? `,${a}` : '';

            funcParentListItem.data = parse(
              `rgb(${rgb.r},${rgb.g},${rgb.b}${alphaString})`,
              {
                context: 'value',
              },
            );
          }

          if (func.name === 'rgb') {
            let r: number | undefined;
            let g: number | undefined;
            let b: number | undefined;
            let a: number | undefined;
            for (const child of children) {
              if (child.type === 'Number') {
                if (r === undefined) {
                  r = Number.parseFloat(child.value);
                  continue;
                }
                if (g === undefined) {
                  g = Number.parseFloat(child.value);
                  continue;
                }
                if (b === undefined) {
                  b = Number.parseFloat(child.value);
                  continue;
                }
                if (a === undefined) {
                  a = Number.parseFloat(child.value);
                  continue;
                }
              }
              if (child.type === 'Percentage') {
                if (r === undefined) {
                  r = (Number.parseFloat(child.value) * 255) / 100;
                  continue;
                }
                if (g === undefined) {
                  g = (Number.parseFloat(child.value) * 255) / 100;
                  continue;
                }
                if (b === undefined) {
                  b = (Number.parseFloat(child.value) * 255) / 100;
                  continue;
                }
                if (a === undefined) {
                  a = Number.parseFloat(child.value) / 100;
                }
              }
            }

            if (r === undefined || g === undefined || b === undefined) {
              throw new Error(
                'Could not determine the parameters of an rgb() function.',
                {
                  cause: declaration,
                },
              );
            }

            if (a === undefined || a === 1) {
              funcParentListItem.data = parse(`rgb(${r},${g},${b})`, {
                context: 'value',
              });
            } else {
              funcParentListItem.data = parse(`rgb(${r},${g},${b},${a})`, {
                context: 'value',
              });
            }
          }
        },
      });
      walk(declaration, {
        visit: 'Hash',
        enter(hash, hashParentListItem) {
          const hex = hash.value.trim();
          if (hex.length === 3) {
            const r = Number.parseInt(hex.charAt(0) + hex.charAt(0), 16);
            const g = Number.parseInt(hex.charAt(1) + hex.charAt(1), 16);
            const b = Number.parseInt(hex.charAt(2) + hex.charAt(2), 16);
            hashParentListItem.data = parse(`rgb(${r},${g},${b})`, {
              context: 'value',
            });
            return;
          }
          if (hex.length === 4) {
            const r = Number.parseInt(hex.charAt(0) + hex.charAt(0), 16);
            const g = Number.parseInt(hex.charAt(1) + hex.charAt(1), 16);
            const b = Number.parseInt(hex.charAt(2) + hex.charAt(2), 16);
            const a = Number.parseInt(hex.charAt(3) + hex.charAt(3), 16) / 255;
            hashParentListItem.data = parse(
              `rgb(${r},${g},${b},${a.toFixed(1)})`,
              { context: 'value' },
            );
            return;
          }
          if (hex.length === 5) {
            const r = Number.parseInt(hex.slice(0, 2), 16);
            const g = Number.parseInt(hex.charAt(2) + hex.charAt(2), 16);
            const b = Number.parseInt(hex.charAt(3) + hex.charAt(3), 16);
            const a = Number.parseInt(hex.charAt(4) + hex.charAt(4), 16) / 255;
            hashParentListItem.data = parse(
              `rgb(${r},${g},${b},${a.toFixed(1)})`,
              { context: 'value' },
            );
            return;
          }
          if (hex.length === 6) {
            const r = Number.parseInt(hex.slice(0, 2), 16);
            const g = Number.parseInt(hex.slice(2, 4), 16);
            const b = Number.parseInt(hex.slice(4, 6), 16);
            hashParentListItem.data = parse(`rgb(${r},${g},${b})`, {
              context: 'value',
            });
            return;
          }
          if (hex.length === 7) {
            const r = Number.parseInt(hex.slice(0, 2), 16);
            const g = Number.parseInt(hex.slice(2, 4), 16);
            const b = Number.parseInt(hex.slice(4, 6), 16);
            const a = Number.parseInt(hex.charAt(6) + hex.charAt(6), 16) / 255;
            hashParentListItem.data = parse(
              `rgb(${r},${g},${b},${a.toFixed(1)})`,
              { context: 'value' },
            );
            return;
          }
          const r = Number.parseInt(hex.slice(0, 2), 16);
          const g = Number.parseInt(hex.slice(2, 4), 16);
          const b = Number.parseInt(hex.slice(4, 6), 16);
          const a = Number.parseInt(hex.slice(6, 8), 16) / 255;
          hashParentListItem.data = parse(
            `rgb(${r},${g},${b},${a.toFixed(1)})`,
            { context: 'value' },
          );
        },
      });

      if (declaration.property === 'padding-inline') {
        const paddingRight = separteShorthandDeclaration(declaration, [
          'padding-left',
          'padding-right',
        ]);
        list.insertData(paddingRight, item);
      }
      if (declaration.property === 'padding-block') {
        const paddingBottom = separteShorthandDeclaration(declaration, [
          'padding-top',
          'padding-bottom',
        ]);
        list.insertData(paddingBottom, item);
      }
      if (declaration.property === 'margin-inline') {
        const marginRight = separteShorthandDeclaration(declaration, [
          'margin-left',
          'margin-right',
        ]);
        list.insertData(marginRight, item);
      }
      if (declaration.property === 'margin-block') {
        const paddingBottom = separteShorthandDeclaration(declaration, [
          'margin-top',
          'margin-bottom',
        ]);

        list.insertData(paddingBottom, item);
      }
    },
  });
}
