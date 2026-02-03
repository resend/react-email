import { mergeAttributes, Node } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { HtmlNode } from './react-html-node.js';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    htmlContent: {
      /**
       * Insert Html
       */
      insertHtml: (userId: string) => ReturnType;
    };
  }
}

export const Html = Node.create({
  name: 'htmlContent',
  group: 'block',
  marks: '',
  atom: true,
  defining: true,
  draggable: true,

  addAttributes() {
    return {
      content: {
        default: '',
      },
      internal_new: {
        default: false,
      },
      internal_event_user_id: {
        default: '',
      },
    };
  },

  renderHTML({ node, HTMLAttributes }) {
    const parent = document.createElement('div');
    parent.setAttribute('data-html-content', 'true');
    parent.innerHTML = node.attrs.content;
    return [
      'div',
      mergeAttributes(
        { ...this.options.HTMLAttributes, 'data-html-content': true },
        HTMLAttributes,
      ),
    ];
  },

  parseHTML() {
    return [
      {
        tag: '[data-html-content]',
      },
    ];
  },

  addCommands() {
    return {
      insertHtml:
        (userId: string) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: {
              internal_new: true,
              internal_event_user_id: userId,
            },
          });
        },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(HtmlNode);
  },
});
