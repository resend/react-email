import bundled from 'shiki/themes/one-dark-pro.mjs';
import { fromBundled } from './_helper.js';

export const oneDark = fromBundled(bundled, {
  textShadow: '0 1px rgba(0, 0, 0, 0.3)',
  fontFamily:
    '"Fira Code", "Fira Mono", Menlo, Consolas, "DejaVu Sans Mono", monospace',
  direction: 'ltr',
  textAlign: 'left',
  whiteSpace: 'pre',
  wordSpacing: 'normal',
  wordBreak: 'normal',
  lineHeight: '1.5',
  MozTabSize: '2',
  OTabSize: '2',
  tabSize: '2',
  WebkitHyphens: 'none',
  MozHyphens: 'none',
  hyphens: 'none',
  padding: '1em',
  margin: '0.5em 0',
  overflow: 'auto',
  borderRadius: '0.3em',
});
