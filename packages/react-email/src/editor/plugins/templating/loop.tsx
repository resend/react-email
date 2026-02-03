import { Node } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { LoopNode } from './react-loop-node';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    loop: {
      insertLoop: (attributes?: { list: string }) => ReturnType;
    };
  }
}

export const Loop = Node.create({
  name: 'loop',
  group: 'block',
  content: 'block+',
  defining: true,

  addAttributes() {
    return {
      list: {
        default: '',
        parseHTML: (element) => element.getAttribute('data-list'),
        renderHTML: (attributes) => ({
          'data-list': attributes.list,
        }),
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="loop"]',
        getAttrs: (node) => {
          if (typeof node === 'string') {
            return false;
          }
          const element = node as HTMLElement;
          const attrs: Record<string, string> = {};

          const list = element.getAttribute('data-list');

          attrs.list = list || '';
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
        'data-type': 'loop',
        'data-list': node.attrs.list,
      },
      0,
    ];
  },

  addCommands() {
    return {
      insertLoop:
        (attributes?: { list: string }) =>
        ({ commands }) => {
          return commands.insertContent({
            type: 'loop',
            attrs: attributes,
          });
        },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(LoopNode);
  },
});
