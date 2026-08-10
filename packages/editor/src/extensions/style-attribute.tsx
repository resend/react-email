import { Extension } from '@tiptap/core';

export interface StyleAttributeOptions {
  types: string[];
  style: string[];
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    textAlign: {
      /**
       * Set the style attribute
       */
      setStyle: (style: string) => ReturnType;
      /**
       * Unset the style attribute
       */
      unsetStyle: () => ReturnType;
    };
  }
}

export const StyleAttribute = Extension.create<StyleAttributeOptions>({
  name: 'styleAttribute',
  priority: 101,

  addOptions() {
    return {
      types: [],
      style: [],
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          style: {
            default: '',
            parseHTML: (element) => element.getAttribute('style') || '',
            renderHTML: (attributes) => {
              return { style: attributes.style ?? '' };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      unsetStyle:
        () =>
        ({ commands }) => {
          return this.options.types.every((type) =>
            commands.resetAttributes(type, 'style'),
          );
        },
      setStyle:
        (style: string) =>
        ({ commands }) => {
          return this.options.types.every((type) =>
            commands.updateAttributes(type, { style }),
          );
        },
    };
  },

  addKeyboardShortcuts() {
    return {
      Enter: ({ editor }) => {
        // Check if any suggestion plugin is active by looking for decorations
        // that indicate an active suggestion/autocomplete
        const { state } = editor.view;
        const { selection } = state;
        const { $from, $to } = selection;

        const textBefore = $from.nodeBefore?.text || '';
        const lastTriggerIndex = textBefore.lastIndexOf('{{');
        const hasUnfinishedTrigger =
          lastTriggerIndex !== -1 &&
          !textBefore.slice(lastTriggerIndex + 2).includes('}}');

        // The suggestion popup is likely handling this Enter press, so don't
        // reset styles
        if (hasUnfinishedTrigger) {
          return false;
        }

        // When Enter splits a paragraph mid-text, the content after the cursor
        // moves into the new paragraph and must keep its styles. Only reset
        // when the cursor is at the end of the block, i.e. when Enter creates
        // a fresh empty paragraph.
        if ($to.parentOffset < $to.parent.content.size) {
          return false;
        }

        // Otherwise, reset paragraph styles on Enter
        requestAnimationFrame(() => {
          editor.commands.resetAttributes('paragraph', 'style');
        });
        return false;
      },
    };
  },
});
