import { mergeAttributes } from '@tiptap/core';
import type { CodeBlockOptions } from '@tiptap/extension-code-block';
import CodeBlock from '@tiptap/extension-code-block';
import { TextSelection } from '@tiptap/pm/state';
import type React from 'react';
import * as ReactEmailComponents from 'react-email';
import {
  type CodeBlockLanguage,
  defaultTheme,
  getHighlighter,
  isThemeLoaded,
  CodeBlock as ReactEmailCodeBlock,
  registerTheme,
  type Theme,
} from 'react-email';
import { EmailNode } from '../core/serializer/email-node';
import { jsToInlineCss } from '../utils/styles';
import { ShikiPlugin } from './shiki-plugin';

function lookupTheme(name: string | undefined | null): Theme | undefined {
  if (!name) return undefined;
  // biome-ignore lint/performance/noDynamicNamespaceImportAccess: theme is user-selected at runtime
  const candidate = (ReactEmailComponents as Record<string, unknown>)[name];
  return candidate &&
    typeof candidate === 'object' &&
    'shikiTheme' in candidate &&
    'base' in candidate
    ? (candidate as Theme)
    : undefined;
}

function preStyleFor(theme: Theme): React.CSSProperties {
  if (!isThemeLoaded(theme.shikiTheme.name)) {
    registerTheme(theme.shikiTheme);
  }
  const resolved = getHighlighter().getTheme(theme.shikiTheme.name);
  return {
    ...(resolved.bg ? { background: resolved.bg } : null),
    ...(resolved.fg ? { color: resolved.fg } : null),
    ...theme.base,
  };
}

export interface CodeBlockPrismOptions extends CodeBlockOptions {
  defaultLanguage: string;
  defaultTheme: string;
}

export const CodeBlockPrism = EmailNode.from(
  CodeBlock.extend<CodeBlockPrismOptions>({
    addOptions(): CodeBlockPrismOptions {
      return {
        languageClassPrefix: 'language-',
        exitOnTripleEnter: false,
        exitOnArrowDown: false,
        enableTabIndentation: true,
        tabSize: 2,
        defaultLanguage: 'javascript',
        defaultTheme: 'default',
        HTMLAttributes: {},
      };
    },

    addAttributes() {
      return {
        ...this.parent?.(),
        language: {
          default: this.options.defaultLanguage,
          parseHTML: (element: HTMLElement | null) => {
            if (!element) {
              return null;
            }
            const { languageClassPrefix } = this.options;
            if (!languageClassPrefix) {
              return null;
            }
            const classNames = [
              ...(element.firstElementChild?.classList || []),
            ];
            const languages = classNames
              .filter((className) =>
                className.startsWith(languageClassPrefix || ''),
              )
              .map((className) => className.replace(languageClassPrefix, ''));
            const language = languages[0];

            if (!language) {
              return null;
            }

            return language;
          },
          rendered: false,
        },
        theme: {
          default: this.options.defaultTheme,
          rendered: false,
        },
      };
    },

    renderHTML({ node, HTMLAttributes }) {
      const theme = lookupTheme(node.attrs.theme) ?? defaultTheme;
      return [
        'pre',
        mergeAttributes(
          this.options.HTMLAttributes,
          HTMLAttributes,
          {
            class: node.attrs.language
              ? `${this.options.languageClassPrefix}${node.attrs.language}`
              : null,
          },
          {
            'data-theme': node.attrs.theme,
            style: jsToInlineCss(preStyleFor(theme)),
          },
        ),
        [
          'code',
          {
            class: node.attrs.language
              ? `${this.options.languageClassPrefix}${node.attrs.language} node-codeTag`
              : 'node-codeTag',
          },
          0,
        ],
      ];
    },

    addKeyboardShortcuts() {
      return {
        ...this.parent?.(),
        'Mod-a': ({ editor }) => {
          const { state } = editor;
          const { selection } = state;
          const { $from } = selection;

          for (let depth = $from.depth; depth >= 1; depth--) {
            if ($from.node(depth).type.name === this.name) {
              const blockStart = $from.start(depth);
              const blockEnd = $from.end(depth);

              const alreadyFullySelected =
                selection.from === blockStart && selection.to === blockEnd;
              if (alreadyFullySelected) {
                return false;
              }

              const tr = state.tr.setSelection(
                TextSelection.create(state.doc, blockStart, blockEnd),
              );
              editor.view.dispatch(tr);
              return true;
            }
          }

          return false;
        },
      };
    },

    addProseMirrorPlugins() {
      return [
        ...(this.parent?.() || []),
        ShikiPlugin({
          name: this.name,
          defaultLanguage: this.options.defaultLanguage,
          defaultTheme: this.options.defaultTheme,
        }),
      ];
    },
  }),
  ({ node, style }) => {
    const language = node.attrs?.language
      ? `${node.attrs.language}`
      : 'javascript';

    // biome-ignore lint/performance/noDynamicNamespaceImportAccess: dynamic access needed for user-selected themes
    const candidate = (ReactEmailComponents as Record<string, unknown>)[
      node.attrs?.theme as string
    ];
    const userTheme =
      candidate &&
      typeof candidate === 'object' &&
      'shikiTheme' in candidate &&
      'base' in candidate
        ? (candidate as Theme)
        : undefined;

    const theme: Theme = userTheme
      ? {
          ...userTheme,
          base: {
            ...userTheme.base,
            borderRadius: '0.125rem',
            padding: '0.75rem 1rem',
          },
        }
      : defaultTheme;

    return (
      <ReactEmailCodeBlock
        code={node.content?.[0]?.text ?? ''}
        language={language as CodeBlockLanguage}
        theme={theme}
        style={{
          width: 'auto',
          ...style,
        }}
      />
    );
  },
);
