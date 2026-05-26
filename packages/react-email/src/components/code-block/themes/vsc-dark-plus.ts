import bundled from 'shiki/themes/dark-plus.mjs';
import { fromBundled } from './_helper.js';

export const vscDarkPlus = fromBundled(bundled, {
  fontSize: '13px',
  textShadow: 'none',
  fontFamily:
    'Menlo, Monaco, Consolas, "Andale Mono", "Ubuntu Mono", "Courier New", monospace',
  direction: 'ltr',
  textAlign: 'left',
  whiteSpace: 'pre',
  wordSpacing: 'normal',
  wordBreak: 'normal',
  lineHeight: '1.5',
  MozTabSize: '4',
  OTabSize: '4',
  tabSize: '4',
  WebkitHyphens: 'none',
  MozHyphens: 'none',
  hyphens: 'none',
  padding: '1em',
  margin: '.5em 0',
  overflow: 'auto',
});
