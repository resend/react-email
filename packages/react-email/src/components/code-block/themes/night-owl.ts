import bundled from 'shiki/themes/night-owl.mjs';
import { fromBundled } from './_helper.js';

export const nightOwl = fromBundled(bundled, {
  fontFamily: 'Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace',
  textAlign: 'left',
  whiteSpace: 'pre',
  wordSpacing: 'normal',
  wordBreak: 'normal',
  wordWrap: 'normal',
  lineHeight: '1.5',
  fontSize: '1em',
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
