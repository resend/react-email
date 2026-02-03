import { mergeAttributes, Node } from '@tiptap/core';
import type { EditorThemes, PanelGroup } from '@/types/editor/styles';
// NOTE: Extensions layer imports from plugins layer - this is acceptable.
import { EDITOR_THEMES } from '../plugins/theming/themes';

export const GLOBAL_CONTENT_NODE_TYPE = 'globalContent' as const;

const initialState: GlobalContentData = {
  css: '',
  styles: EDITOR_THEMES.basic,
  theme: 'basic',
};

export interface GlobalContentData {
  css?: string;
  styles?: PanelGroup[];
  theme?: EditorThemes;
}

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

  // parseRule: {
  //   context: 'block',
  // },

  addAttributes() {
    return {
      data: {
        default: this.options.data,
      },
    };
  },

  parseHTML() {
    return [{ tag: `div[data-type="${this.name}"]` }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        'data-type': this.name,
        style: 'display: none;',
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
