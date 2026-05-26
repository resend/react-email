export * from './code-block.js';
export {
  ensureLanguage,
  ensureTheme,
  getHighlighter,
  isLanguageLoaded,
  isThemeLoaded,
  registerTheme,
  resolveLanguage,
  type LanguageInput,
} from './highlighter.js';
export {
  isLanguageRegistered,
  registerLanguage,
  resolveLanguageString,
} from './language-registry.js';
export type { Theme } from './themes/_helper.js';
export * from './themes/index.js';

/**
 * Legacy alias for the `language` prop of `<CodeBlock>`. Kept so code
 * written against the prism-based API still type-checks.
 *
 * @deprecated Use {@link LanguageInput} instead.
 */
export type PrismLanguage = string;

/**
 * Legacy alias for the `language` prop of `<CodeBlock>`.
 *
 * @deprecated Use {@link LanguageInput} instead.
 */
export type CodeBlockLanguage = string;
