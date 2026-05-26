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
 * with zero languages and zero themes loaded — consumers register what
 * they need via `registerLanguage` and `registerTheme` so the bundler
 * can tree-shake away anything that isn't used.
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

const ALIASES: Record<string, string> = {
  shell: 'bash',
  sh: 'bash',
  zsh: 'bash',
  svg: 'xml',
  htm: 'html',
  yml: 'yaml',
  md: 'markdown',
  js: 'javascript',
  ts: 'typescript',
};

export function resolveLanguageAlias(language: string): string {
  return ALIASES[language] ?? language;
}

export function isLanguageLoaded(language: string): boolean {
  return getHighlighter()
    .getLoadedLanguages()
    .includes(resolveLanguageAlias(language));
}

export function isThemeLoaded(themeName: string): boolean {
  return getHighlighter().getLoadedThemes().includes(themeName);
}

export function registerLanguage(
  language: LanguageRegistration | LanguageRegistration[],
): void {
  getHighlighter().loadLanguageSync(language);
}

export function registerTheme(theme: ThemeRegistrationAny): void {
  getHighlighter().loadThemeSync(theme);
}
