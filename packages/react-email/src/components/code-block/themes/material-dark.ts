import bundled from 'shiki/themes/material-theme-darker.mjs';
import { fromBundled } from './_helper.js';

export const materialDark = fromBundled(bundled, {
  textAlign: 'left',
  whiteSpace: 'pre',
  wordSpacing: 'normal',
  wordBreak: 'normal',
  wordWrap: 'normal',
  fontFamily: 'Roboto Mono, monospace',
  fontSize: '1em',
  lineHeight: '1.5em',
  MozTabSize: '4',
  OTabSize: '4',
  tabSize: '4',
  WebkitHyphens: 'none',
  MozHyphens: 'none',
  hyphens: 'none',
  overflow: 'auto',
  position: 'relative',
  margin: '0.5em 0',
  padding: '1.25em 1em',
});
