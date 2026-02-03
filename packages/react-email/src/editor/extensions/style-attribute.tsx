import { Extension } from '@tiptap/core';

interface StyleAttributeOptions {
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
            parseHTML: (element) => ignoreInitialCssValues(element.style),
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

const IGNORE_DEFAULT_VALUES = new Map<string, string>([
  ['font-size-ligatures', 'normal'],
  ['font-variant-caps', 'normal'],
  ['orphans', '2'],
  ['windows', '2'],
  ['text-indent', '0'],
]);

function ignoreInitialCssValues(cssObject: CSSStyleDeclaration): string {
  const IGNORE_VALUE_SET = new Set(['none', 'initial', 'inherit', 'unset']);

  const result: string[] = [];
  const length = cssObject.length;

  for (let i = 0; i < length; i++) {
    const property = cssObject[i];
    const value = cssObject.getPropertyValue(property);

    if (
      !value ||
      IGNORE_VALUE_SET.has(value) ||
      IGNORE_DEFAULT_VALUES.get(property) === value
    ) {
      console.warn(`Ignoring initial CSS value for property ${property}`);
      continue;
    }

    result.push(`${property}: ${value}`);
  }

  return result.join('; ');
}
