import { mergeAttributes, Node } from '@tiptap/core';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    button: {
      setButton: () => ReturnType;
      updateButton: (attributes: Record<string, unknown>) => ReturnType;
    };
  }
}

// TODO: the name is ambiguous, rename to ReactEmailButton 
export const EditorButton = Node.create({
  name: 'button',
  group: 'block',
  content: 'inline*',
  defining: true,
  draggable: true,
  marks: 'bold',

  addAttributes() {
    return {
      class: {
        default: 'button',
      },
      href: {
        default: '#',
      },
      alignment: {
        default: 'left',
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'a[data-id="react-email-button"]',
        getAttrs: (node) => {
          if (typeof node === 'string') {
            return false;
          }
          const element = node as HTMLElement;
          const attrs: Record<string, string> = {};

          // Preserve all attributes
          Array.from(element.attributes).forEach((attr) => {
            attrs[attr.name] = attr.value;
          });

          return attrs;
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes({
        class: `align-${HTMLAttributes?.alignment}`,
      }),
      [
        'a',
        mergeAttributes({
          class: `node-button ${HTMLAttributes?.class}`,
          style: HTMLAttributes?.style,
          'data-id': 'react-email-button',
          'data-href': HTMLAttributes?.href,
        }),
        0,
      ],
    ];
  },

  addCommands() {
    return {
      updateButton:
        (attributes) =>
        ({ commands }) => {
          return commands.updateAttributes('button', attributes);
        },

      setButton:
        () =>
        ({ commands }) => {
          return commands.insertContent({
            type: 'button',
            content: [
              {
                type: 'text',
                text: 'Button',
              },
            ],
          });
        },
    };
  },
});
