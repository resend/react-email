import { Extension } from '@tiptap/core';

interface ClassAttributeOptions {
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
        requestAnimationFrame(() => {
          editor.commands.resetAttributes('paragraph', 'class');
        });

        return false;
      },
    };
  },
});
