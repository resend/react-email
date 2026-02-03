import { mergeAttributes, Node } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { ReactEmailTwitter } from './react-email-twitter';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    twitter: {
      insertTweet: (userId: string) => ReturnType;
    };
  }
}

export const EditorTwitter = Node.create({
  name: 'twitter',
  group: 'block',
  marks: '',
  atom: true,
  addAttributes() {
    return {
      class: {
        default: 'twitter',
      },
      alignment: {
        default: 'left',
      },
      internal_darkMode: {
        default: false,
      },
      internal_linkHref: {
        default: '',
      },
      internal_imageSource: {
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
  parseHTML() {
    return [
      {
        tag: 'a[data-id="react-email-twitter"]',
      },
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return [
      'a',
      mergeAttributes(
        { ...this.options.HTMLAttributes, 'data-id': 'react-email-twitter' },
        HTMLAttributes,
      ),
      0,
    ];
  },
  addCommands() {
    return {
      insertTweet:
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
    return ReactNodeViewRenderer(ReactEmailTwitter);
  },
});
