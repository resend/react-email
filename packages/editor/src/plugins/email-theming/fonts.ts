export interface EmailFont {
  label: string;
  /** Full `font-family` stack, always ending in a generic family. */
  value: string;
}

export const DEFAULT_FONT_FAMILY =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif";

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
];
