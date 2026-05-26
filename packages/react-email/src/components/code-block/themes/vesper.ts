import bundled from 'shiki/themes/vesper.mjs';
import { fromBundled } from './_helper.js';

export const vesper = fromBundled(bundled, {
  fontFamily: "Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace",
  textAlign: 'left',
  whiteSpace: 'pre',
  wordSpacing: 'normal',
  wordBreak: 'normal',
  wordWrap: 'normal',
  lineHeight: '1.5',
  MozTabSize: '4',
  OTabSize: '4',
  tabSize: '4',
  WebkitHyphens: 'none',
  MozHyphens: 'none',
  hyphens: 'none',
  overflowX: 'auto',
});
