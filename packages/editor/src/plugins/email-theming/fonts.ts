export interface EmailFont {
  label: string;
  /** Full `font-family` stack, always ending in a generic family. */
  value: string;
  /** Stylesheet to load; clients that block it fall back to the rest of the stack. */
  webFontUrl?: string;
}

export const DEFAULT_FONT_FAMILY =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif";

const googleFont = (family: string, weights: string) =>
  `https://fonts.googleapis.com/css2?family=${family.replace(/ /g, '+')}:wght@${weights}&display=swap`;

export const EMAIL_FONTS: EmailFont[] = [
  { label: 'Default', value: DEFAULT_FONT_FAMILY },
  { label: 'Arial', value: 'Arial, Helvetica, sans-serif' },
  { label: 'Helvetica', value: 'Helvetica, Arial, sans-serif' },
  { label: 'Verdana', value: 'Verdana, Geneva, sans-serif' },
  { label: 'Tahoma', value: 'Tahoma, Verdana, sans-serif' },
  {
    label: 'Trebuchet MS',
    value: "'Trebuchet MS', Helvetica, sans-serif",
  },
  { label: 'Georgia', value: "Georgia, 'Times New Roman', serif" },
  {
    label: 'Times New Roman',
    value: "'Times New Roman', Times, serif",
  },
  {
    label: 'Courier New',
    value: "'Courier New', Courier, monospace",
  },
  {
    label: 'Inter',
    value: "'Inter', Arial, Helvetica, sans-serif",
    webFontUrl: googleFont('Inter', '400;500;600;700'),
  },
  {
    label: 'Roboto',
    value: "'Roboto', Arial, Helvetica, sans-serif",
    webFontUrl: googleFont('Roboto', '400;500;700'),
  },
  {
    label: 'Open Sans',
    value: "'Open Sans', Arial, Helvetica, sans-serif",
    webFontUrl: googleFont('Open Sans', '400;600;700'),
  },
  {
    label: 'Lato',
    value: "'Lato', Arial, Helvetica, sans-serif",
    webFontUrl: googleFont('Lato', '400;700'),
  },
];

/** Stylesheet URLs for the web fonts among the given `font-family` values. */
export function getWebFontUrls(fontFamilies: Iterable<unknown>): string[] {
  const used = new Set(fontFamilies);
  return EMAIL_FONTS.flatMap((font) =>
    font.webFontUrl && used.has(font.value) ? [font.webFontUrl] : [],
  );
}
