import * as ReactEmailComponents from '@react-email/components';
import {
  type PrismLanguage,
  CodeBlock as ReactEmailCodeBlock,
  type Theme,
} from '@react-email/components';
import { mergeAttributes } from '@tiptap/core';
import type { CodeBlockOptions } from '@tiptap/extension-code-block';
import CodeBlock from '@tiptap/extension-code-block';
import { TextSelection } from '@tiptap/pm/state';
import { EmailNode } from '../core/email-node';
import { PrismPlugin } from './prism-plugin';

export interface CodeBlockPrismOptions extends CodeBlockOptions {
  defaultLanguage: string;
  defaultTheme: string;
}

const DEFAULT_TAB_SIZE = 2;

function getThemeTabSize(themeName: string | undefined): number {
  if (!themeName) return DEFAULT_TAB_SIZE;
  // @ts-expect-error -- dynamic access to theme exports
  const theme = ReactEmailComponents[themeName] as Theme | undefined;
  if (!theme?.base) return DEFAULT_TAB_SIZE;
  const raw = (theme.base as Record<string, unknown>).tabSize;
  if (raw == null) return DEFAULT_TAB_SIZE;
  const parsed = Number(raw);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_TAB_SIZE;
}

export const CodeBlockPrism = EmailNode.from(
  CodeBlock.extend<CodeBlockPrismOptions>({
    addOptions(): CodeBlockPrismOptions {
      return {
        languageClassPrefix: 'language-',
        exitOnTripleEnter: false,
        exitOnArrowDown: false,
        enableTabIndentation: true,
        tabSize: DEFAULT_TAB_SIZE,
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

    addKeyboardShortcuts() {
      return {
        ...this.parent?.(),
        Tab: ({ editor }) => {
          if (!this.options.enableTabIndentation) {
            return false;
          }
          const { state } = editor;
          const { selection } = state;
          const { $from, empty } = selection;
          if ($from.parent.type !== this.type) {
            return false;
          }
          const tabSize = getThemeTabSize($from.parent.attrs.theme);
          const indent = ' '.repeat(tabSize);
          if (empty) {
            return editor.commands.insertContent(indent);
          }
          return editor.commands.command(({ tr }) => {
            const { from, to } = selection;
            const text = state.doc.textBetween(from, to, '\n', '\n');
            const lines = text.split('\n');
            const indentedText = lines
              .map((line) => indent + line)
              .join('\n');
            tr.replaceWith(from, to, state.schema.text(indentedText));
            return true;
          });
        },
        'Shift-Tab': ({ editor }) => {
          if (!this.options.enableTabIndentation) {
            return false;
          }
          const { state } = editor;
          const { selection } = state;
          const { $from, empty } = selection;
          if ($from.parent.type !== this.type) {
            return false;
          }
          const tabSize = getThemeTabSize($from.parent.attrs.theme);
          if (empty) {
            return editor.commands.command(({ tr }) => {
              const { pos } = $from;
              const codeBlockStart = $from.start();
              const codeBlockEnd = $from.end();
              const allText = state.doc.textBetween(
                codeBlockStart,
                codeBlockEnd,
                '\n',
                '\n',
              );
              const lines = allText.split('\n');
              let currentLineIndex = 0;
              let charCount = 0;
              const relativeCursorPos = pos - codeBlockStart;
              for (let i = 0; i < lines.length; i += 1) {
                if (charCount + lines[i].length >= relativeCursorPos) {
                  currentLineIndex = i;
                  break;
                }
                charCount += lines[i].length + 1;
              }
              const currentLine = lines[currentLineIndex];
              const leadingSpaces = currentLine.match(/^ */)?.[0] || '';
              const spacesToRemove = Math.min(leadingSpaces.length, tabSize);
              if (spacesToRemove === 0) {
                return true;
              }
              let lineStartPos = codeBlockStart;
              for (let i = 0; i < currentLineIndex; i += 1) {
                lineStartPos += lines[i].length + 1;
              }
              tr.delete(lineStartPos, lineStartPos + spacesToRemove);
              const cursorPosInLine = pos - lineStartPos;
              if (cursorPosInLine <= spacesToRemove) {
                tr.setSelection(
                  TextSelection.create(tr.doc, lineStartPos),
                );
              }
              return true;
            });
          }
          return editor.commands.command(({ tr }) => {
            const { from, to } = selection;
            const text = state.doc.textBetween(from, to, '\n', '\n');
            const lines = text.split('\n');
            const reverseIndentText = lines
              .map((line) => {
                const leadingSpaces = line.match(/^ */)?.[0] || '';
                const spacesToRemove = Math.min(
                  leadingSpaces.length,
                  tabSize,
                );
                return line.slice(spacesToRemove);
              })
              .join('\n');
            tr.replaceWith(from, to, state.schema.text(reverseIndentText));
            return true;
          });
        },
      };
    },

    renderHTML({ node, HTMLAttributes }) {
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
          { 'data-theme': node.attrs.theme },
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
        PrismPlugin({
          name: this.name,
          defaultLanguage: this.options.defaultLanguage,
          defaultTheme: this.options.defaultTheme,
        }),
      ];
    },
  }),
  ({ node, styles }) => {
    const language = node.attrs?.language
      ? `${node.attrs.language}`
      : 'javascript';

    // @ts-expect-error -- @react-email/components does not export theme objects by name; dynamic access needed for user-selected themes
    const userTheme = ReactEmailComponents[node.attrs?.theme];

    // Without theme, render a gray code block
    const theme = userTheme
      ? {
          ...userTheme,
          base: {
            ...userTheme.base,
            borderRadius: '0.125rem',
            padding: '0.75rem 1rem',
          },
        }
      : {
          base: {
            color: '#1e293b',
            background: '#f1f5f9',
            lineHeight: '1.5',
            fontFamily:
              '"Fira Code", "Fira Mono", Menlo, Consolas, "DejaVu Sans Mono", monospace',
            padding: '0.75rem 1rem',
            borderRadius: '0.125rem',
          },
        };

    return (
      <ReactEmailCodeBlock
        code={node.content?.[0]?.text ?? ''}
        language={language as PrismLanguage}
        theme={theme}
        style={{
          width: 'auto',
          ...styles.codeBlock,
        }}
      />
    );
  },
);
