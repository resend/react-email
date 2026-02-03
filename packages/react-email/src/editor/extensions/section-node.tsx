import { mergeAttributes, Node } from '@tiptap/core';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    section: {
      insertSection: () => ReturnType;
    };
  }
}

export const Section = Node.create({
  name: 'section',
  group: 'block',
  content: 'block+',
  isolating: true,
  defining: true,

  parseHTML() {
    return [{ tag: 'section[data-type="section"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'section',
      mergeAttributes(
        { 'data-type': 'section', class: 'node-section' },
        HTMLAttributes,
      ),
      0,
    ];
  },

  addCommands() {
    return {
      insertSection:
        () =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            content: [
              {
                type: 'paragraph',
                content: [],
              },
            ],
          });
        },
    };
  },
});
