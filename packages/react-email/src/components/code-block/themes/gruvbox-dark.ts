import bundled from 'shiki/themes/gruvbox-dark-hard.mjs';
import { fromBundled } from './_helper.js';

export const gruvboxDark = fromBundled(bundled, {
  fontFamily: 'Consolas, Monaco, "Andale Mono", monospace',
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
  margin: '0.5em 0',
  overflow: 'auto',
});
