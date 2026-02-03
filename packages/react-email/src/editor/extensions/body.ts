import { mergeAttributes, Node } from '@tiptap/core';
import {
  COMMON_HTML_ATTRIBUTES,
  createStandardAttributes,
  LAYOUT_ATTRIBUTES,
} from './attribute-helpers.js';

export interface BodyOptions {
  HTMLAttributes: Record<string, any>;
}

export const Body = Node.create<BodyOptions>({
  name: 'body',

  group: 'block',

  content: 'block+',

  defining: true,

  addAttributes() {
    return {
      ...createStandardAttributes([
        ...COMMON_HTML_ATTRIBUTES,
        ...LAYOUT_ATTRIBUTES,
      ]),
    };
  },

  parseHTML() {
    return [
      {
        tag: 'body',
        getAttrs: (node) => {
          if (typeof node === 'string') {
            return false;
          }
          const element = node as HTMLElement;
          const attrs: Record<string, string> = {};

          // Preserve all attributes
          Array.from(element.attributes).forEach((attr) => {
            attrs[attr.name] = attr.value;
          });

          return attrs;
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      0,
    ];
  },
});
