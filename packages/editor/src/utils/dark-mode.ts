/**
 * CSS injected into the email head to keep content visible in dark-mode mail
 * clients (Apple Mail / iOS), which auto-darken light emails by recoloring text
 * but leave some properties — like native list markers — at their original
 * color. `::marker` can't be styled inline, so the rules have to live here.
 */
export const DARK_MODE_CSS =
  '@media (prefers-color-scheme: dark){li::marker{color:#c4c4c4}}';

interface ParsedColor {
  channels: number[];
  alpha: number;
}

export function protectButtonColors(
  style: React.CSSProperties,
): React.CSSProperties {
  const background = parseColor(style.backgroundColor);
  if (!background || background.alpha < 1) return style;
  const painted = isPureBlack(background)
    ? { ...style, backgroundColor: '#010101' }
    : style;
  const label = parseColor(style.color);
  if (
    !label ||
    relativeLuminance(label) <= relativeLuminance(background) ||
    style.background ||
    (style.backgroundImage && style.backgroundImage !== 'none')
  ) {
    return painted;
  }
  return { ...painted, WebkitTextFillColor: style.color };
}

const isPureBlack = ({ channels }: ParsedColor) =>
  channels.every((channel) => channel === 0);

function parseColor(value: unknown): ParsedColor | undefined {
  if (typeof value !== 'string') return undefined;
  const color = value.trim().toLowerCase();
  const hex = color.match(/^#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/)?.[1];
  if (hex) {
    const digits =
      hex.length <= 4 ? [...hex].map((digit) => digit + digit).join('') : hex;
    const [r, g, b, a = 255] = [0, 2, 4, 6].map((offset) =>
      digits.length > offset
        ? Number.parseInt(digits.slice(offset, offset + 2), 16)
        : undefined,
    );
    if (r === undefined || g === undefined || b === undefined) return undefined;
    return { channels: [r, g, b], alpha: a / 255 };
  }
  const rgb = color.match(
    /^rgba?\(\s*(\d+)[\s,]+(\d+)[\s,]+(\d+)(?:\s*[,/]\s*([\d.]+)(%?))?\s*\)$/,
  );
  if (!rgb) return undefined;
  const alpha = rgb[4] === undefined ? 1 : Number(rgb[4]) / (rgb[5] ? 100 : 1);
  return {
    channels: [Number(rgb[1]), Number(rgb[2]), Number(rgb[3])],
    alpha,
  };
}

function relativeLuminance({ channels }: ParsedColor) {
  const [r, g, b] = channels.map((channel) => {
    const c = channel / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
