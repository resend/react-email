import bundled from 'shiki/themes/laserwave.mjs';
import { fromBundled } from './_helper.js';

export const laserwave = fromBundled(bundled, {
  fontFamily: 'Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace',
  fontSize: '1em',
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
  borderRadius: '0.5em',
});
