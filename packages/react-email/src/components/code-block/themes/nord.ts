import bundled from 'shiki/themes/nord.mjs';
import { fromBundled } from './_helper.js';

export const nord = fromBundled(bundled, {
  fontFamily:
    "\"Fira Code\", Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace",
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
  padding: '1em',
  margin: '.5em 0',
  overflow: 'auto',
  borderRadius: '0.3em',
});
