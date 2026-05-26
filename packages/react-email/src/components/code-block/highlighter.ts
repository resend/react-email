import {
  createHighlighterCoreSync,
  type HighlighterCore,
  type LanguageRegistration,
  type ThemeRegistrationAny,
} from 'shiki/core';
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript';

let _highlighter: HighlighterCore | null = null;

/**
 * Returns the shared shiki highlighter singleton. The highlighter starts
 * with zero languages and zero themes loaded — `<CodeBlock>` registers
 * what it needs lazily from the props it receives, so the bundler can
 * tree-shake away anything that isn't used.
 */
export function getHighlighter(): HighlighterCore {
  if (_highlighter) return _highlighter;
  _highlighter = createHighlighterCoreSync({
    engine: createJavaScriptRegexEngine(),
    themes: [],
    langs: [],
  });
  return _highlighter;
}

/**
 * Idempotently loads a language module into the shared highlighter and
 * returns the canonical name shiki knows it by. Pass the default export
 * of a `shiki/langs/<name>.mjs` import.
 */
export function ensureLanguage(
  language: LanguageRegistration | LanguageRegistration[],
): string {
  const modules = Array.isArray(language) ? language : [language];
  const name = modules[0]?.name;
  if (!name) {
    throw new Error(
      'CodeBlock: `language` prop is missing a `name` — pass the default export of a shiki language module, e.g. `import javascript from "shiki/langs/javascript.mjs"`.',
    );
  }
  const hl = getHighlighter();
  if (!hl.getLoadedLanguages().includes(name)) {
    hl.loadLanguageSync(modules);
  }
  return name;
}

/**
 * Idempotently loads a theme into the shared highlighter.
 */
export function ensureTheme(theme: ThemeRegistrationAny): string {
  const name = (theme as { name?: string }).name;
  if (!name) {
    throw new Error('CodeBlock: `theme.shikiTheme` is missing a `name`.');
  }
  const hl = getHighlighter();
  if (!hl.getLoadedThemes().includes(name)) {
    hl.loadThemeSync(theme);
  }
  return name;
}
