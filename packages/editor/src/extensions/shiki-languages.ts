import { registerLanguage } from 'react-email';
import bash from 'shiki/langs/bash.mjs';
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
 * Eagerly registers the set of languages the editor's inspector dropdown
 * exposes (plus the aliases shiki resolves through them: `js` → javascript,
 * `shell` → bash, `svg` → xml, etc). Importing this module is a side
 * effect — it loads each grammar into the shared shiki highlighter on
 * first evaluation.
 *
 * Languages are imported statically so bundlers ship exactly this set
 * with no dynamic chunks (turbopack pulls entire directories when it
 * encounters a dynamic shiki import, which makes consumer apps slow).
 */
registerLanguage(bash);
registerLanguage(css);
registerLanguage(go);
registerLanguage(html);
registerLanguage(javascript);
registerLanguage(json);
registerLanguage(jsx);
registerLanguage(markdown);
registerLanguage(php);
registerLanguage(python);
registerLanguage(ruby);
registerLanguage(shellscript);
registerLanguage(sql);
registerLanguage(tsx);
registerLanguage(typescript);
registerLanguage(xml);
