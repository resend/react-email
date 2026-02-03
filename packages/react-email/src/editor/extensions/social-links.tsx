import { mergeAttributes, Node } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { SocialNode } from './react-social-node';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    socialLinks: {
      /**
       * Insert Html
       */
      insertSocialLinks: (userId: string) => ReturnType;
    };
  }
}

export const SocialLinks = Node.create({
  name: 'socialLinks',
  group: 'block',
  marks: '',
  atom: true,

  addAttributes() {
    return {
      class: {
        default: 'socialLinks',
      },
      content: {
        default: '',
      },
      internal_new: {
        default: false,
      },
      internal_event_user_id: {
        default: '',
      },
      links: {
        default: {},
      },
    };
  },

  renderHTML({ node, HTMLAttributes }) {
    const parent = document.createElement('div');
    parent.setAttribute('data-social-links', 'true');
    parent.innerHTML = node.attrs.content;
    return [
      'div',
      mergeAttributes(
        { ...this.options.HTMLAttributes, 'data-social-links': true },
        HTMLAttributes,
      ),
    ];
  },

  parseHTML() {
    return [
      {
        tag: '[data-social-links]',
      },
    ];
  },

  addCommands() {
    return {
      insertSocialLinks:
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
    return ReactNodeViewRenderer(SocialNode);
  },
});
