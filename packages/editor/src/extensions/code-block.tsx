import { mergeAttributes } from '@tiptap/core';
import type { CodeBlockOptions } from '@tiptap/extension-code-block';
import CodeBlock from '@tiptap/extension-code-block';
import { Fragment, type Schema } from '@tiptap/pm/model';
import { TextSelection } from '@tiptap/pm/state';
import * as ReactEmailComponents from 'react-email';
import {
  type PrismLanguage,
  CodeBlock as ReactEmailCodeBlock,
} from 'react-email';
import { EmailNode } from '../core/serializer/email-node';
import { inlineCssToJs } from '../utils/styles';
import { PrismPlugin } from './prism-plugin';

export interface CodeBlockPrismOptions extends CodeBlockOptions {
  defaultLanguage: string;
  defaultTheme: string;
}

// The email renderer encodes spaces as NBSP + ZWJ + ZWSP so mail clients keep
// the indentation. Pasting normalizes the NBSP away, so accept either one.
const ENCODED_SPACE_REGEX = /[\u00A0 ]\u200D\u200B/g;

const TEXT_NODE = 3;

function readCodeFromElement(element: HTMLElement): string {
  let code = '';
  let endsOnLineBreak = false;

  const visit = (node: Node) => {
    if (node.nodeType === TEXT_NODE) {
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

  return code.replace(ENCODED_SPACE_REGEX, ' ');
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
            const code = readCodeFromElement(element as HTMLElement);
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

    // @ts-expect-error -- react-email does not export theme objects by name; dynamic access needed for user-selected themes
    // biome-ignore lint/performance/noDynamicNamespaceImportAccess: dynamic access needed for user-selected themes
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
        // Neither the language nor the theme is recoverable from the rendered
        // markup, so mark them for whoever imports this email back.
        data-language={language}
        data-theme={node.attrs?.theme}
        language={language as PrismLanguage}
        theme={theme}
        style={{
          width: 'auto',
          ...style,
          ...inlineCssToJs(node.attrs?.style),
        }}
      />
    );
  },
);
