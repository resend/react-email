import {
  createHighlighterCoreSync,
  type HighlighterCore,
  type LanguageRegistration,
  type ThemeRegistrationAny,
} from 'shiki/core';
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript';
import { resolveLanguageString } from './language-registry.js';
import type { Theme } from './themes/_helper.js';

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

export type LanguageInput =
  | LanguageRegistration
  | LanguageRegistration[]
  | string;

/**
 * Idempotently loads a language into the shared highlighter and returns
 * the canonical name shiki knows it by. Accepts either a shiki language
 * module (default export of `shiki/langs/<name>.mjs`) or a string name
 * that resolves against the built-in registry plus anything registered
 * via {@link import('./language-registry.js').registerLanguage}.
 */
export function ensureLanguage(language: LanguageInput): string {
  let modules: LanguageRegistration[];
  if (typeof language === 'string') {
    const resolved = resolveLanguageString(language);
    if (!resolved) {
      throw new Error(
        `CodeBlock: no language registered for "${language}". Either pass a shiki language module (e.g. \`import javascript from "shiki/langs/javascript.mjs"\`) or call \`registerLanguage("${language}", module)\` first.`,
      );
    }
    modules = Array.isArray(resolved) ? resolved : [resolved];
  } else {
    modules = Array.isArray(language) ? language : [language];
  }
  const name = modules[0]?.name;
  if (!name) {
    throw new Error(
      'CodeBlock: `language` is missing a `name` — pass the default export of a shiki language module, e.g. `import javascript from "shiki/langs/javascript.mjs"`.',
    );
  }
  const hl = getHighlighter();
  if (!hl.getLoadedLanguages().includes(name)) {
    hl.loadLanguageSync(modules);
  }
  return name;
}

/**
 * Idempotently loads a theme into the shared highlighter. Accepts either
 * a raw shiki theme registration or a `Theme` object exported from this
 * package (it'll pick the inner `shikiTheme` automatically).
 */
export function ensureTheme(theme: ThemeRegistrationAny | Theme): string {
  const shiki =
    'shikiTheme' in theme
      ? theme.shikiTheme
      : (theme as ThemeRegistrationAny);
  const name = (shiki as { name?: string }).name;
  if (!name) {
    throw new Error('CodeBlock: theme is missing a `name`.');
  }
  const hl = getHighlighter();
  if (!hl.getLoadedThemes().includes(name)) {
    hl.loadThemeSync(shiki);
  }
  return name;
}

/**
 * Whether a theme has already been loaded into the shared highlighter.
 *
 * @deprecated Prefer {@link ensureTheme}, which is idempotent.
 */
export function isThemeLoaded(name: string): boolean {
  return getHighlighter().getLoadedThemes().includes(name);
}

/**
 * Whether a language has already been loaded into the shared highlighter.
 *
 * @deprecated Prefer {@link ensureLanguage}, which is idempotent.
 */
export function isLanguageLoaded(name: string): boolean {
  return getHighlighter().getLoadedLanguages().includes(name);
}

/**
 * Resolves a string language name to the canonical name shiki uses,
 * loading the module if needed. Returns the input untouched if a module
 * is passed directly.
 *
 * @deprecated Use {@link ensureLanguage}.
 */
export function resolveLanguage(language: LanguageInput): string {
  return ensureLanguage(language);
}

/**
 * Loads a theme into the shared highlighter by name. Accepts the same
 * shapes as {@link ensureTheme}.
 *
 * @deprecated Use {@link ensureTheme}.
 */
export function registerTheme(theme: ThemeRegistrationAny | Theme): string {
  return ensureTheme(theme);
}
