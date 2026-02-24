import { mergeAttributes, Node } from '@tiptap/core';

export const GLOBAL_CONTENT_NODE_TYPE = 'globalContent' as const;

const initialState: Record<string, unknown> = { };

export type GlobalContentData = Record<string, unknown>;

export interface GlobalContentOptions {
  key: string;
  data: GlobalContentData;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    globalContent: {
      setGlobalContent: (data: Partial<GlobalContentData>) => ReturnType;
    };
  }
}

export const GlobalContent = Node.create<GlobalContentOptions>({
  name: GLOBAL_CONTENT_NODE_TYPE,

  addOptions() {
    return {
      key: GLOBAL_CONTENT_NODE_TYPE,
      data: initialState,
    };
  },

  group: 'block',

  selectable: false,
  draggable: false,
  atom: true,

  addAttributes() {
    return {
      data: {
        default: JSON.stringify(this.options.data),
      },
    };
  },

  parseHTML() {
    return [{ tag: `div[data-type="${this.options.key}"]` }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        'data-type': this.options.key,
        // The node needs to have a width and height, so then
        // internal TipTap extension can find the first node position
        // and calculate the correct position of the document container
        style: 'width: 100%; height: 1px; visibility: hidden;',
      }),
    ];
  },

  addCommands() {
    return {
      setGlobalContent:
        (data: Partial<GlobalContentData>) =>
        ({ tr, dispatch }) => {
          if (dispatch) {
            const positions: number[] = [];

            // Find all global content components
            tr.doc.descendants((node, position) => {
              if (node.type.name === this.name) {
                positions.push(position);
              }
            });

            // Keep only the first one, remove others from last to first
            for (let i = positions.length - 1; i > 0; i--) {
              tr.delete(positions[i], positions[i] + 1);
            }

            // Update or create the component
            const pos = positions[0] ?? -1;
            if (pos >= 0) {
              tr.setNodeAttribute(pos, 'data', {
                ...initialState,
                ...tr.doc.nodeAt(pos)?.attrs.data,
                ...data,
              });
            } else {
              const node = this.type.create({ data });
              tr.insert(0, node);
            }
          }

          return true;
        },
    };
  },
});

