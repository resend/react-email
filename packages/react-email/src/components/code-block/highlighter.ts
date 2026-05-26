import {
  createHighlighterCoreSync,
  type HighlighterCore,
  type LanguageRegistration,
  type ThemeRegistrationAny,
} from 'shiki/core';
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript';
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
import sql from 'shiki/langs/sql.mjs';
import tsx from 'shiki/langs/tsx.mjs';
import typescript from 'shiki/langs/typescript.mjs';
import xml from 'shiki/langs/xml.mjs';
import yaml from 'shiki/langs/yaml.mjs';

const BUILTIN_LANGS: LanguageRegistration[][] = [
  bash,
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
  sql,
  tsx,
  typescript,
  xml,
  yaml,
];

let _highlighter: HighlighterCore | null = null;

export function getHighlighter(): HighlighterCore {
  if (_highlighter) return _highlighter;
  _highlighter = createHighlighterCoreSync({
    engine: createJavaScriptRegexEngine(),
    themes: [],
    langs: BUILTIN_LANGS,
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

/**
 * Dynamically loads a language bundled with shiki by name and registers it
 * with the shared highlighter. Used by the editor for languages that aren't
 * pre-bundled.
 */
export async function loadShikiLanguage(language: string): Promise<void> {
  const resolved = resolveLanguageAlias(language);
  if (isLanguageLoaded(resolved)) return;
  const mod = (await import(
    /* @vite-ignore */ `shiki/langs/${resolved}.mjs`
  )) as { default: LanguageRegistration | LanguageRegistration[] };
  registerLanguage(mod.default);
}
