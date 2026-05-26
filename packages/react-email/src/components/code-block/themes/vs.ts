import bundled from 'shiki/themes/light-plus.mjs';
import { fromBundled } from './_helper.js';

export const vs = fromBundled(bundled, {
  fontFamily:
    '"Consolas", "Bitstream Vera Sans Mono", "Courier New", Courier, monospace',
  direction: 'ltr',
  textAlign: 'left',
  whiteSpace: 'pre',
  wordSpacing: 'normal',
  wordBreak: 'normal',
  fontSize: '.9em',
  lineHeight: '1.2em',
  MozTabSize: '4',
  OTabSize: '4',
  tabSize: '4',
  WebkitHyphens: 'none',
  MozHyphens: 'none',
  hyphens: 'none',
  padding: '1em',
  margin: '.5em 0',
  overflow: 'auto',
  border: '1px solid #dddddd',
});
