import * as ReactEmailComponents from '@react-email/components';
import {
  type PrismLanguage,
  CodeBlock as ReactEmailCodeBlock,
} from '@react-email/components';
import { mergeAttributes } from '@tiptap/core';
import type { CodeBlockOptions } from '@tiptap/extension-code-block';
import CodeBlock from '@tiptap/extension-code-block';
import { EmailNode } from '../core/email-node';
import { PrismPlugin } from './prism-plugin';

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
