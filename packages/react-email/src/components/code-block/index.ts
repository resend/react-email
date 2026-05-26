export * from './code-block.js';
export {
  getHighlighter,
  isLanguageLoaded,
  isThemeLoaded,
  loadShikiLanguage,
  registerLanguage,
  registerTheme,
  resolveLanguageAlias,
} from './highlighter.js';
export type { CodeBlockLanguage, PrismLanguage } from './languages-available.js';
export type { Theme } from './themes/_helper.js';
export * from './themes/index.js';
