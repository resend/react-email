import { Slot } from '@radix-ui/react-slot';
import Color from 'colorjs.io';
import type { ComponentProps } from 'react';

function* walkDom(element: Element): Generator<Element> {
  if (element.children.length > 0) {
    for (let i = 0; i < element.children.length; i++) {
      const child = element.children.item(i)!;
      yield child;
      yield* walkDom(child);
    }
  }
}

function invertColor(colorString: string, mode: 'foreground' | 'background') {
  try {
    const color = new Color(colorString).to('lch');

    if (mode === 'background') {
      // Keeps the same lightness if it's already dark. If it's bright inverts the lightness
      // - This is a characteristic from Outlook iOS
      // - Parcel does something very similar
      // 
      // The 0.75 factor ensures that, even if the lightness is 100%, the final inverted is going to be 25%
      // - This is a characteristic from Apple Mail
      //
      // The two extra 50 terms are so that the lightness inversion doesn't become a step function
      if (color.lch.l! >= 50) {
        color.lch.l = 50 - (color.lch.l! - 50) * 0.75;
      }
    } else if (mode === 'foreground') {
      // The same as what's done for background, but inverts the check for brightness.
      // If the color is already bright, then it keeps the same. If the color is dark, then it inverts the brightness
      if (color.lch.l! < 50) {
        color.lch.l = 50 - (color.lch.l! - 50) * 0.75;
      }
    }

    color.lch.c! *= 0.8;

    return color.toString();
  } catch (exception) {
    console.error(`couldn't invert color ${colorString}`, exception);
    return colorString;
  }
}

const colorRegex = () =>
  /#[0-9a-f]{3,4}|#[0-9a-f]{6,8}|(rgb|rgba|hsl|hsv|oklab|oklch|lab|lch|hwb)\s*\(.*?\)/gi;
const namedColors = {
  aliceblue: '#f0f8ff',
  antiquewhite: '#faebd7',
  aqua: '#00ffff',
  aquamarine: '#7fffd4',
  azure: '#f0ffff',
  beige: '#f5f5dc',
  bisque: '#ffe4c4',
  black: '#000000',
  blanchedalmond: '#ffebcd',
  blue: '#0000ff',
  blueviolet: '#8a2be2',
  brown: '#a52a2a',
  burlywood: '#deb887',
  cadetblue: '#5f9ea0',
  chartreuse: '#7fff00',
  chocolate: '#d2691e',
  coral: '#ff7f50',
  cornflowerblue: '#6495ed',
  cornsilk: '#fff8dc',
  crimson: '#dc143c',
  cyan: '#00ffff',
  darkblue: '#00008b',
  darkcyan: '#008b8b',
  darkgoldenrod: '#b8860b',
  darkgray: '#a9a9a9',
  darkgreen: '#006400',
  darkgrey: '#a9a9a9',
  darkkhaki: '#bdb76b',
  darkmagenta: '#8b008b',
  darkolivegreen: '#556b2f',
  darkorange: '#ff8c00',
  darkorchid: '#9932cc',
  darkred: '#8b0000',
  darksalmon: '#e9967a',
  darkseagreen: '#8fbc8f',
  darkslateblue: '#483d8b',
  darkslategray: '#2f4f4f',
  darkslategrey: '#2f4f4f',
  darkturquoise: '#00ced1',
  darkviolet: '#9400d3',
  deeppink: '#ff1493',
  deepskyblue: '#00bfff',
  dimgray: '#696969',
  dimgrey: '#696969',
  dodgerblue: '#1e90ff',
  firebrick: '#b22222',
  floralwhite: '#fffaf0',
  forestgreen: '#228b22',
  fuchsia: '#ff00ff',
  gainsboro: '#dcdcdc',
  ghostwhite: '#f8f8ff',
  gold: '#ffd700',
  goldenrod: '#daa520',
  gray: '#808080',
  green: '#008000',
  greenyellow: '#adff2f',
  grey: '#808080',
  honeydew: '#f0fff0',
  hotpink: '#ff69b4',
  indianred: '#cd5c5c',
  indigo: '#4b0082',
  ivory: '#fffff0',
  khaki: '#f0e68c',
  lavender: '#e6e6fa',
  lavenderblush: '#fff0f5',
  lawngreen: '#7cfc00',
  lemonchiffon: '#fffacd',
  lightblue: '#add8e6',
  lightcoral: '#f08080',
  lightcyan: '#e0ffff',
  lightgoldenrodyellow: '#fafad2',
  lightgray: '#d3d3d3',
  lightgreen: '#90ee90',
  lightgrey: '#d3d3d3',
  lightpink: '#ffb6c1',
  lightsalmon: '#ffa07a',
  lightseagreen: '#20b2aa',
  lightskyblue: '#87cefa',
  lightslategray: '#778899',
  lightslategrey: '#778899',
  lightsteelblue: '#b0c4de',
  lightyellow: '#ffffe0',
  lime: '#00ff00',
  limegreen: '#32cd32',
  linen: '#faf0e6',
  magenta: '#ff00ff',
  maroon: '#800000',
  mediumaquamarine: '#66cdaa',
  mediumblue: '#0000cd',
  mediumorchid: '#ba55d3',
  mediumpurple: '#9370db',
  mediumseagreen: '#3cb371',
  mediumslateblue: '#7b68ee',
  mediumspringgreen: '#00fa9a',
  mediumturquoise: '#48d1cc',
  mediumvioletred: '#c71585',
  midnightblue: '#191970',
  mintcream: '#f5fffa',
  mistyrose: '#ffe4e1',
  moccasin: '#ffe4b5',
  navajowhite: '#ffdead',
  navy: '#000080',
  oldlace: '#fdf5e6',
  olive: '#808000',
  olivedrab: '#6b8e23',
  orange: '#ffa500',
  orangered: '#ff4500',
  orchid: '#da70d6',
  palegoldenrod: '#eee8aa',
  palegreen: '#98fb98',
  paleturquoise: '#afeeee',
  palevioletred: '#db7093',
  papayawhip: '#ffefd5',
  peachpuff: '#ffdab9',
  peru: '#cd853f',
  pink: '#ffc0cb',
  plum: '#dda0dd',
  powderblue: '#b0e0e6',
  purple: '#800080',
  rebeccapurple: '#663399',
  red: '#ff0000',
  rosybrown: '#bc8f8f',
  royalblue: '#4169e1',
  saddlebrown: '#8b4513',
  salmon: '#fa8072',
  sandybrown: '#f4a460',
  seagreen: '#2e8b57',
  seashell: '#fff5ee',
  sienna: '#a0522d',
  silver: '#c0c0c0',
  skyblue: '#87ceeb',
  slateblue: '#6a5acd',
  slategray: '#708090',
  slategrey: '#708090',
  snow: '#fffafa',
  springgreen: '#00ff7f',
  steelblue: '#4682b4',
  tan: '#d2b48c',
  teal: '#008080',
  thistle: '#d8bfd8',
  tomato: '#ff6347',
  transparent: 'rgba(0,0,0,0)',
  turquoise: '#40e0d0',
  violet: '#ee82ee',
  wheat: '#f5deb3',
  white: '#ffffff',
  whitesmoke: '#f5f5f5',
  yellow: '#ffff00',
  yellowgreen: '#9acd32',
};
const namedColorRegex = new RegExp(
  `${Object.keys(namedColors).join('|')}`,
  'gi',
);

function applyColorInversion(iframe: HTMLIFrameElement) {
  const { contentDocument, contentWindow } = iframe;
  if (!contentDocument || !contentWindow) return;

  if (!contentDocument.body.style.color) {
    contentDocument.body.style.color = 'rgb(0, 0, 0)';
  }

  for (const element of walkDom(contentDocument.documentElement)) {
    if (
      element instanceof
      (contentWindow as unknown as typeof globalThis).HTMLElement
    ) {
      if (element.style.color) {
        element.style.color = element.style.color
          .replaceAll(colorRegex(), (color) => invertColor(color, 'foreground'))
          .replaceAll(namedColorRegex, (namedColor) =>
            invertColor(namedColors[namedColor], 'foreground'),
          );
        namedColorRegex.lastIndex = 0;
      }
      if (element.style.background) {
        element.style.background = element.style.background
          .replaceAll(colorRegex(), (color) => invertColor(color, 'background'))
          .replaceAll(namedColorRegex, (namedColor) =>
            invertColor(namedColors[namedColor], 'foreground'),
          );
        namedColorRegex.lastIndex = 0;
      }
      if (element.style.backgroundColor) {
        element.style.backgroundColor = element.style.backgroundColor
          .replaceAll(colorRegex(), (color) => invertColor(color, 'background'))
          .replaceAll(namedColorRegex, (namedColor) =>
            invertColor(namedColors[namedColor], 'foreground'),
          );
        namedColorRegex.lastIndex = 0;
      }
      if (element.style.borderColor) {
        element.style.borderColor = element.style.borderColor
          .replaceAll(colorRegex(), (color) => invertColor(color, 'background'))
          .replaceAll(namedColorRegex, (namedColor) =>
            invertColor(namedColors[namedColor], 'foreground'),
          );
        namedColorRegex.lastIndex = 0;
      }
      if (element.style.border) {
        element.style.border = element.style.border
          .replaceAll(colorRegex(), (color) => invertColor(color, 'background'))
          .replaceAll(namedColorRegex, (namedColor) =>
            invertColor(namedColors[namedColor], 'foreground'),
          );
        namedColorRegex.lastIndex = 0;
      }
    }
  }
}

interface EmailFrameProps extends ComponentProps<'iframe'> {
  markup: string;
  width: number;
  height: number;
  darkMode: boolean;
}

export function EmailFrame({
  markup,
  width,
  height,
  darkMode,
  ...rest
}: EmailFrameProps) {
  return (
    <Slot
      ref={(iframe: HTMLIFrameElement) => {
        if (!iframe) return;

        applyColorInversion(iframe);
      }}
    >
      <iframe
        srcDoc={markup}
        width={width}
        height={height}
        onLoad={(event) => {
          if (darkMode) {
            const iframe = event.currentTarget;
            applyColorInversion(iframe);
          }
        }}
        {...rest}
        // This key makes sure that the iframe itself remounts to the DOM when theme changes, so
        // that the color changes in dark mode can be easily undone when switching to light mode.
        key={darkMode ? 'iframe-inverted-colors' : 'iframe-normal-colors'}
      />
    </Slot>
  );
}
