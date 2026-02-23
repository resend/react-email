import { Extension } from '@tiptap/core';

interface AlignmentOptions {
  types: string[];
  alignments: string[];
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    alignment: {
      /**
       * Set the text align attribute
       */
      setAlignment: (alignment: string) => ReturnType;
    };
  }
}

export const AlignmentAttribute = Extension.create<AlignmentOptions>({
  name: 'alignmentAttribute',

  addOptions() {
    return {
      types: [],
      alignments: ['left', 'center', 'right', 'justify'],
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          alignment: {
            parseHTML: (element) => {
              const explicitAlign =
                element.getAttribute('align') ||
                element.getAttribute('alignment') ||
                element.style.textAlign;
              if (
                explicitAlign &&
                this.options.alignments.includes(explicitAlign)
              ) {
                return explicitAlign;
              }

              // Return null to let natural inheritance work
              return null;
            },
            renderHTML: (attributes) => {
              if (attributes.alignment === 'left') {
                return {};
              }

              return { alignment: attributes.alignment };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setAlignment:
        (alignment) =>
        ({ commands }) => {
          if (!this.options.alignments.includes(alignment)) {
            return false;
          }

          return this.options.types.every((type) =>
            commands.updateAttributes(type, { alignment }),
          );
        },
    };
  },

  addKeyboardShortcuts() {
    return {
      Enter: () => {
        // Get the current node's alignment
        const { from } = this.editor.state.selection;
        const node = this.editor.state.doc.nodeAt(from);
        const currentAlignment = node?.attrs?.alignment;

        if (currentAlignment) {
          requestAnimationFrame(() => {
            // Preserve the current alignment when creating new nodes
            this.editor.commands.setAlignment(currentAlignment);
          });
        }

        return false;
      },
      'Mod-Shift-l': () => this.editor.commands.setAlignment('left'),
      'Mod-Shift-e': () => this.editor.commands.setAlignment('center'),
      'Mod-Shift-r': () => this.editor.commands.setAlignment('right'),
      'Mod-Shift-j': () => this.editor.commands.setAlignment('justify'),
    };
  },
});
