import { mergeAttributes, Node } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { ReactEmailYouTube } from './react-email-youtube';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    youtube: {
      insertYouTube: (userId: string) => ReturnType;
    };
  }
}

export const EditorYouTube = Node.create({
  name: 'youtube',
  group: 'block',
  marks: '',
  atom: true,

  addAttributes() {
    return {
      class: {
        default: 'youtube',
      },
      alignment: {
        default: 'left',
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
        tag: 'a[data-id="react-email-youtube"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'a',
      mergeAttributes(
        { ...this.options.HTMLAttributes, 'data-id': 'react-email-youtube' },
        HTMLAttributes,
      ),
      0,
    ];
  },

  addCommands() {
    return {
      insertYouTube:
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
    return ReactNodeViewRenderer(ReactEmailYouTube);
  },
});
