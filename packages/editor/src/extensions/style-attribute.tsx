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
        const { $from } = selection;

        // Check if we're in a position where suggestion might be active
        // by looking at the text before cursor for trigger characters
        const textBefore = $from.nodeBefore?.text || '';
        const hasTrigger =
          textBefore.includes('{{') || textBefore.includes('{{{');

        // If we have trigger characters, assume suggestion might be handling this
        // Don't reset styles
        if (hasTrigger) {
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
