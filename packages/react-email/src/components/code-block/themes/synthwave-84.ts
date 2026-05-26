import bundled from 'shiki/themes/synthwave-84.mjs';
import { fromBundled } from './_helper.js';

export const synthwave84 = fromBundled(bundled, {
  textShadow: '0 0 2px #100c0f, 0 0 5px #dc078e33, 0 0 10px #fff3',
  fontFamily: "Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace",
  fontSize: '1em',
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
});
