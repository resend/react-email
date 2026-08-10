import { Extension } from '@tiptap/core';

export interface ClassAttributeOptions {
  types: string[];
  class: string[];
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    class: {
      /**
       * Set the class attribute
       */
      setClass: (classList: string) => ReturnType;
      /**
       * Unset the class attribute
       */
      unsetClass: () => ReturnType;
    };
  }
}

export const ClassAttribute = Extension.create<ClassAttributeOptions>({
  name: 'classAttribute',

  addOptions() {
    return {
      types: [],
      class: [],
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          class: {
            default: '',
            parseHTML: (element) => element.className || '',
            renderHTML: (attributes) => {
              return attributes.class ? { class: attributes.class } : {};
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      unsetClass:
        () =>
        ({ commands }) => {
          return this.options.types.every((type) =>
            commands.resetAttributes(type, 'class'),
          );
        },
      setClass:
        (classList: string) =>
        ({ commands }) => {
          return this.options.types.every((type) =>
            commands.updateAttributes(type, { class: classList }),
          );
        },
    };
  },

  addKeyboardShortcuts() {
    return {
      Enter: ({ editor }) => {
        const { $to } = editor.view.state.selection;

        // When Enter splits a paragraph mid-text, the content after the cursor
        // moves into the new paragraph and must keep its class. Only reset
        // when the cursor is at the end of the block, i.e. when Enter creates
        // a fresh empty paragraph.
        if ($to.parentOffset < $to.parent.content.size) {
          return false;
        }

        requestAnimationFrame(() => {
          editor.commands.resetAttributes('paragraph', 'class');
        });

        return false;
      },
    };
  },
});
