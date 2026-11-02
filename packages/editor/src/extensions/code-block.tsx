import { mergeAttributes } from '@tiptap/core';
import type { CodeBlockOptions } from '@tiptap/extension-code-block';
import CodeBlock from '@tiptap/extension-code-block';
import { Fragment, type Schema } from '@tiptap/pm/model';
import { TextSelection } from '@tiptap/pm/state';
import { lazy } from 'react';
import type { PrismLanguage } from 'react-email';
import { EmailNode } from '../core/serializer/email-node';
import { inlineCssToJs } from '../utils/styles';
import { PrismPlugin } from './prism-plugin';

export interface CodeBlockPrismOptions extends CodeBlockOptions {
  defaultLanguage: string;
  defaultTheme: string;
}

// Inverts the NBSP + ZWJ + ZWSP that react-email's CodeBlock writes for every
// space so Spark Mail keeps the indentation.
const ENCODED_SPACE_REGEX = /\u00A0\u200D\u200B/g;

// react-email's CodeBlock carries every Prism grammar and theme, so it is only
// loaded once an email with a code block is rendered, not wherever the editor
// is mounted. `render()` waits for it inside its Suspense boundary.
const CodeBlockEmail = lazy(() =>
  import('./code-block-email.js').then((module) => ({
    default: module.CodeBlockEmail,
  })),
);

export const CodeBlockPrism = EmailNode.from(
  CodeBlock.extend<CodeBlockPrismOptions>({
    addOptions(): CodeBlockPrismOptions {
      return {
        languageClassPrefix: 'language-',
        exitOnTripleEnter: false,
        exitOnArrowDown: false,
        exitOnArrowUp: false,
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
              return element.getAttribute('data-language');
            }

            return language;
          },
          rendered: false,
        },
        theme: {
          default: this.options.defaultTheme,
          parseHTML: (element: HTMLElement | null) =>
            element?.getAttribute('data-theme') || null,
          rendered: false,
        },
      };
    },

    parseHTML() {
      return [
        {
          tag: 'pre',
          preserveWhitespace: 'full' as const,
          getContent: (element: Node, schema: Schema) => {
            let code = '';
            let endsOnLineBreak = false;

            const visit = (node: Node) => {
              if (node.nodeType === Node.TEXT_NODE) {
                const text = node.nodeValue ?? '';
                if (text) {
                  code += text;
                  endsOnLineBreak = false;
                }
                return;
              }

              if (node.nodeName === 'BR') {
                code += '\n';
                endsOnLineBreak = true;
                return;
              }

              node.childNodes.forEach(visit);
            };
            element.childNodes.forEach(visit);

            if (endsOnLineBreak) {
              code = code.slice(0, -1);
            }
            code = code.replace(ENCODED_SPACE_REGEX, ' ');

            return code ? Fragment.from(schema.text(code)) : Fragment.empty;
          },
        },
      ];
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
  ({ node, style }) => {
    const language = node.attrs?.language
      ? `${node.attrs.language}`
      : 'javascript';

    return (
      <CodeBlockEmail
        code={node.content?.[0]?.text ?? ''}
        // Neither the language nor the theme is recoverable from the rendered
        // markup, so mark them for whoever imports this email back.
        data-language={language}
        data-theme={node.attrs?.theme}
        language={language as PrismLanguage}
        themeName={node.attrs?.theme}
        style={{
          width: 'auto',
          ...style,
          ...inlineCssToJs(node.attrs?.style),
        }}
      />
    );
  },
);
