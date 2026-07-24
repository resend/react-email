import { type Editor, mergeAttributes, Node } from '@tiptap/core';
import type { Node as PmNode } from '@tiptap/pm/model';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { hasCollaborationExtension } from '../utils/is-collaboration';

const GLOBAL_CONTENT_NODE_TYPE = 'globalContent' as const;

export interface GlobalContentOptions {
  key: string;
  data: Record<string, unknown>;
}

declare module '@tiptap/core' {
  interface GlobalContent<ReturnType> {
    setGlobalContent: (key: string, value: unknown) => ReturnType;
  }

  interface Commands<ReturnType> {
    globalContent: GlobalContent<ReturnType>;
  }
}

let cachedGlobalPosition: number | null = null;

function findGlobalContentPositions(doc: Editor['state']['doc']) {
  const positions: number[] = [];

  doc.descendants((node, position) => {
    if (node.type.name === GLOBAL_CONTENT_NODE_TYPE) {
      positions.push(position);
    }
  });

  return positions;
}

function getCachedGlobalContentPosition(doc: Editor['state']['doc']) {
  if (cachedGlobalPosition != null) {
    try {
      if (
        doc.nodeAt(cachedGlobalPosition)?.type.name === GLOBAL_CONTENT_NODE_TYPE
      ) {
        return cachedGlobalPosition;
      }
    } catch {
      cachedGlobalPosition = null;
    }
  }

  const positions = findGlobalContentPositions(doc);
  cachedGlobalPosition = positions[0] ?? null;
  return cachedGlobalPosition;
}

export function getGlobalContent(key: string, editor: Editor): unknown | null {
  const position = getCachedGlobalContentPosition(editor.state.doc);
  if (cachedGlobalPosition == null) {
    return null;
  }
  return editor.state.doc.nodeAt(position)?.attrs.data[key] ?? null;
}

export const GlobalContent = Node.create<GlobalContentOptions>({
  name: GLOBAL_CONTENT_NODE_TYPE,

  addOptions() {
    return {
      key: GLOBAL_CONTENT_NODE_TYPE,
      data: {},
    };
  },

  group: 'block',

  selectable: false,
  draggable: false,
  atom: true,

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
        // The node needs to have a width and height, so then
        // internal TipTap extension can find the first node position
        // and calculate the correct position of the document container
        style:
          'width: 100%; height: 1px; visibility: hidden; background-color: transparent;',
      }),
    ];
  },

  addCommands() {
    return {
      setGlobalContent:
        (key: string, value: unknown) =>
        ({ tr, dispatch }) => {
          const ensureGlobalPosition = () => {
            const positions = findGlobalContentPositions(tr.doc);

            for (let i = positions.length - 1; i > 0; i--) {
              tr.delete(positions[i], positions[i] + 1);
            }

            const pos = positions[0] ?? -1;
            if (pos >= 0) {
              cachedGlobalPosition = pos;
            } else {
              cachedGlobalPosition = 0;
              tr.insert(0, this.type.create());
            }
          };

          if (dispatch) {
            ensureGlobalPosition();

            if (cachedGlobalPosition == null) {
              return false;
            }
            tr.setNodeAttribute(cachedGlobalPosition, 'data', {
              ...tr.doc.nodeAt(cachedGlobalPosition)?.attrs.data,
              [key]: value,
            });
          }

          return true;
        },
    };
  },

  addProseMirrorPlugins() {
    const nodeType = this.type;
    const isCollaborative = hasCollaborationExtension(
      this.editor.extensionManager.extensions,
    );

    return [
      new Plugin({
        key: new PluginKey('globalContentProtector'),

        view: isCollaborative
          ? undefined
          : (editorView) => {
              let lastGlobalContentNode: PmNode | null = null;

              const findAndCache = (doc: PmNode) => {
                let found: PmNode | null = null;
                doc.descendants((node) => {
                  if (node.type.name === GLOBAL_CONTENT_NODE_TYPE) {
                    found = node;
                    return false;
                  }
                });
                if (found) {
                  lastGlobalContentNode = found;
                }
                return found;
              };

              findAndCache(editorView.state.doc);

              return {
                update(view) {
                  const doc = view.state.doc;
                  const current = findAndCache(doc);

                  if (!current && lastGlobalContentNode) {
                    const restoredNode = nodeType.create(
                      lastGlobalContentNode.attrs,
                    );
                    const tr = view.state.tr;
                    tr.insert(0, restoredNode);
                    tr.setMeta('addToHistory', false);
                    cachedGlobalPosition = 0;
                    view.dispatch(tr);
                  }
                },
              };
            },

        appendTransaction(_transactions, oldState, newState) {
          if (findGlobalContentPositions(newState.doc).length > 0) {
            return null;
          }

          // Skip no-op transactions from collaboration extensions (e.g.
          // Liveblocks stabilisation rounds) to avoid restoring the node
          // before the real document content arrives — same guard used by
          // the containerEnforcer plugin.
          if (newState.doc.eq(oldState.doc)) {
            return null;
          }

          let previousNode: PmNode | null = null;
          oldState.doc.descendants((node) => {
            if (node.type.name === GLOBAL_CONTENT_NODE_TYPE) {
              previousNode = node;
              return false;
            }
          });

          if (!previousNode) {
            return null;
          }

          const restoredNode = nodeType.create((previousNode as PmNode).attrs);
          const tr = newState.tr;
          tr.insert(0, restoredNode);
          tr.setMeta('addToHistory', false);
          cachedGlobalPosition = 0;

          return tr;
        },
      }),
    ];
  },
});
