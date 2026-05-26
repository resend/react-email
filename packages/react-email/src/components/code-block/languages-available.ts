import type { BundledLanguage } from 'shiki/langs';

/**
 * The set of languages bundled with shiki. The same value can be passed to
 * the `language` prop of `<CodeBlock>` or registered manually via
 * `registerLanguage()`.
 */
export type CodeBlockLanguage = BundledLanguage;

/**
 * Backwards-compatible alias. New code should prefer {@link CodeBlockLanguage}.
 *
 * @deprecated Use `CodeBlockLanguage` instead.
 */
export type PrismLanguage = CodeBlockLanguage;
