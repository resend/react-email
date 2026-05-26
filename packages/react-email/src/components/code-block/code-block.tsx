import * as React from 'react';
import type { LanguageRegistration } from 'shiki/core';
import {
  ensureLanguage,
  ensureTheme,
  getHighlighter,
} from './highlighter.js';
import type { Theme } from './themes/_helper.js';

export interface CodeBlockProps extends React.ComponentPropsWithoutRef<'pre'> {
  lineNumbers?: boolean;

  /**
   * Applies a font family to every element rendered inside the block. Mainly
   * exists so a global font from `<Font>` can be overridden for code.
   */
  fontFamily?: string;

  theme: Theme;

  /**
   * A shiki language module. Import the language you want to highlight
   * from `shiki/langs/<name>.mjs` and pass the default export.
   *
   * @example
   * ```tsx
   * import javascript from 'shiki/langs/javascript.mjs';
   *
   * <CodeBlock language={javascript} theme={dracula} code="..." />
   * ```
   */
  language: LanguageRegistration | LanguageRegistration[];
  code: string;
}

const NBSP_ZWJ_ZWSP = '\xA0‍​';

// Bit flags from vscode-textmate's FontStyle enum, inlined here so we don't
// have to import the runtime enum (only its type is exported from shiki).
const FONT_STYLE_ITALIC = 1;
const FONT_STYLE_BOLD = 2;
const FONT_STYLE_UNDERLINE = 4;

export const CodeBlock = React.forwardRef<HTMLPreElement, CodeBlockProps>(
  ({ code, fontFamily, lineNumbers, theme, language, ...rest }, ref) => {
    const highlighter = getHighlighter();
    const langName = ensureLanguage(language);
    const themeName = ensureTheme(theme.shikiTheme);

    const lines = highlighter.codeToTokensBase(code, {
      lang: langName,
      theme: themeName,
      includeExplanation: false,
    });

    const resolvedTheme = highlighter.getTheme(themeName);

    return (
      <pre
        {...rest}
        ref={ref}
        style={{
          ...(resolvedTheme.bg ? { background: resolvedTheme.bg } : null),
          ...(resolvedTheme.fg ? { color: resolvedTheme.fg } : null),
          ...theme.base,
          width: '100%',
          ...rest.style,
        }}
      >
        <code>
          {lines.map((tokens, lineIndex) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: lines are stable for a given render
            <React.Fragment key={lineIndex}>
              {lineNumbers ? (
                <span
                  style={{
                    width: '2em',
                    height: '1em',
                    display: 'inline-block',
                    fontFamily,
                  }}
                >
                  {lineIndex + 1}
                </span>
              ) : null}
              {tokens.map((token, i) => {
                const fs = token.fontStyle ?? 0;
                const italic = (fs & FONT_STYLE_ITALIC) !== 0;
                const bold = (fs & FONT_STYLE_BOLD) !== 0;
                const underline = (fs & FONT_STYLE_UNDERLINE) !== 0;
                return (
                  // biome-ignore lint/suspicious/noArrayIndexKey: tokens within a line are positionally stable
                  <span
                    key={i}
                    style={{
                      fontFamily,
                      color: token.color,
                      ...(token.bgColor
                        ? { backgroundColor: token.bgColor }
                        : null),
                      ...(italic ? { fontStyle: 'italic' } : null),
                      ...(bold ? { fontWeight: 'bold' } : null),
                      ...(underline ? { textDecoration: 'underline' } : null),
                    }}
                  >
                    {token.content.replaceAll(' ', NBSP_ZWJ_ZWSP)}
                  </span>
                );
              })}
              <br />
            </React.Fragment>
          ))}
        </code>
      </pre>
    );
  },
);

CodeBlock.displayName = 'CodeBlock';
