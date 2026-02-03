import { Node } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { ConditionalNode } from './react-conditional-node';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    conditional: {
      insertConditional: (attributes?: {
        test: string;
        negate?: boolean;
      }) => ReturnType;
    };
  }
}

export const Conditional = Node.create({
  name: 'conditional',
  group: 'block',
  content: 'block+',
  defining: true,

  addAttributes() {
    return {
      test: {
        default: '',
        parseHTML: (element) => element.getAttribute('data-test'),
        renderHTML: (attributes) => ({
          'data-test': attributes.test,
        }),
      },
      negate: {
        default: false,
        parseHTML: (element) => element.getAttribute('data-negate') === 'true',
        renderHTML: (attributes) => ({
          'data-negate': attributes.negate ? 'true' : 'false',
        }),
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="conditional"]',
        getAttrs: (node) => {
          if (typeof node === 'string') {
            return false;
          }
          const element = node as HTMLElement;
          const attrs: Record<string, any> = {};

          const test = element.getAttribute('data-test');
          const negate = element.getAttribute('data-negate');

          attrs.test = test || '';
          attrs.negate = negate === 'true';

          return attrs;
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes, node }) {
    return [
      'div',
      {
        ...HTMLAttributes,
        'data-type': 'conditional',
        'data-test': node.attrs.test,
        'data-negate': node.attrs.negate ? 'true' : 'false',
      },
      0,
    ];
  },

  addCommands() {
    return {
      insertConditional:
        (attributes?: { test: string; negate?: boolean }) =>
        ({ commands }) => {
          return commands.insertContent({
            type: 'conditional',
            attrs: attributes,
          });
        },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(ConditionalNode);
  },
});
