import { mergeAttributes } from '@tiptap/core';
import type { CodeBlockOptions } from '@tiptap/extension-code-block';
import CodeBlock from '@tiptap/extension-code-block';
import { PrismPlugin } from './prism-plugin.js';

export interface CodeBlockPrismOptions extends CodeBlockOptions {
  defaultLanguage: string;
  defaultTheme: string;
}

// Should this me migrated to the CodeBlock component instead?
export const CodeBlockPrism = CodeBlock.extend<CodeBlockPrismOptions>({
  addOptions(): CodeBlockPrismOptions {
    return {
      languageClassPrefix: 'language-',
      exitOnTripleEnter: false,
      exitOnArrowDown: false,
      enableTabIndentation: false,
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
          const classNames = [...(element.firstElementChild?.classList || [])];
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
});
