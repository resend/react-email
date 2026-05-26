import type { LanguageRegistration } from 'shiki/core';
import css from 'shiki/langs/css.mjs';
import go from 'shiki/langs/go.mjs';
import html from 'shiki/langs/html.mjs';
import javascript from 'shiki/langs/javascript.mjs';
import json from 'shiki/langs/json.mjs';
import jsx from 'shiki/langs/jsx.mjs';
import markdown from 'shiki/langs/markdown.mjs';
import php from 'shiki/langs/php.mjs';
import python from 'shiki/langs/python.mjs';
import ruby from 'shiki/langs/ruby.mjs';
import shellscript from 'shiki/langs/shellscript.mjs';
import sql from 'shiki/langs/sql.mjs';
import tsx from 'shiki/langs/tsx.mjs';
import typescript from 'shiki/langs/typescript.mjs';
import xml from 'shiki/langs/xml.mjs';

/**
 * The set of shiki language modules the inspector's language dropdown
 * exposes, keyed by the string stored in `node.attrs.language`. Each
 * value is the default export of a `shiki/langs/<name>.mjs` import
 * (statically — bundlers ship exactly this set and nothing else).
 *
 * Aliases shiki already resolves natively (e.g. `bash`/`sh`/`zsh` →
 * shellscript, `js` → javascript) are intentionally not duplicated
 * here; the highlighter handles them once the parent grammar is
 * registered.
 */
export const EDITOR_LANGUAGES: Record<
  string,
  LanguageRegistration | LanguageRegistration[]
> = {
  css,
  go,
  html,
  javascript,
  json,
  jsx,
  markdown,
  php,
  python,
  ruby,
  shell: shellscript,
  sql,
  svg: xml,
  tsx,
  typescript,
};
