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

});
