import { defineTheme } from './_helper.js';

/**
 * Neutral fallback used when the consumer has not picked a specific theme.
 * Sets a readable background and foreground but does not color tokens, so
 * the block renders as a plain monospace box.
 */
export const defaultTheme = defineTheme({
  name: 'default',
  type: 'light',
  base: {
    color: '#1e293b',
    background: '#f1f5f9',
    lineHeight: '1.5',
    fontFamily:
      '"Fira Code", "Fira Mono", Menlo, Consolas, "DejaVu Sans Mono", monospace',
    padding: '0.75rem 1rem',
    borderRadius: '0.125rem',
  },
  palette: {},
});
