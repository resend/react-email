import { Node } from '@tiptap/core';

export interface PreviewTextOptions {
  HTMLAttributes: Record<string, any>;
}

export const PreviewText = Node.create<PreviewTextOptions>({
  name: 'previewText',

  group: 'block',

  selectable: false,
  draggable: false,
  atom: true,

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  addStorage() {
    return {
      previewText: null,
    };
  },

  renderHTML() {
    return ['div', { style: 'display: none' }];
  },

  parseHTML() {
    return [
      // react-email parsing
      {
        tag: 'div[data-skip-in-text="true"]',
        getAttrs: (node) => {
          if (typeof node === 'string') {
            return false;
          }
          const element = node as HTMLElement;

          // Extract and store preview text directly
          let directText = '';
          for (const child of element.childNodes) {
            if (child.nodeType === 3) {
              // TEXT_NODE = 3
              // Anything other than text will be pruned
              // This is particularly useful for react email,
              // because we have a nested div full of white spaces that will just be ignored
              directText += child.textContent || '';
            }
          }
          const cleanText = directText.trim();

          if (cleanText) {
            this.storage.previewText = cleanText;
          }

          return false; // Don't create a node
        },
      },
      // preheader class parsing
      {
        tag: 'span.preheader',
        getAttrs: (node) => {
          if (typeof node === 'string') {
            return false;
          }
          const element = node as HTMLElement;
          const preheaderText = element.textContent?.trim();

          if (preheaderText) {
            this.storage.previewText = preheaderText;
          }

          return false; // Don't create a node, just extract to storage
        },
      },
    ];
  },
});
