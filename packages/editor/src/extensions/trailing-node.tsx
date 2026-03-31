// Most of this code was copied over from https://github.com/ueberdosis/tiptap which is MIT licensed and allows for this.

import { Extension } from '@tiptap/core';
import type { Node, NodeType } from '@tiptap/pm/model';
import { Plugin, PluginKey } from '@tiptap/pm/state';

export const skipTrailingNodeMeta = 'skipTrailingNode';

function nodeEqualsType({
  types,
  node,
}: {
  types: NodeType | NodeType[];
  node: Node | null | undefined;
}) {
  return (
    (node && Array.isArray(types) && types.includes(node.type)) ||
    node?.type === types
  );
}

/**
 * Extension based on:
 * - https://github.com/ueberdosis/tiptap/blob/v1/packages/tiptap-extensions/src/extensions/TrailingNode.js
 * - https://github.com/remirror/remirror/blob/e0f1bec4a1e8073ce8f5500d62193e52321155b9/packages/prosemirror-trailing-node/src/trailing-node-plugin.ts
 */

export interface TrailingNodeOptions {
  /**
   * The node type that should be inserted at the end of the document.
   * @note the node will always be added to the `notAfter` lists to
   * prevent an infinite loop.
   * @default undefined
   */
  node?: string;
  /**
    * The node that the trailing node should be appended to. The default is the 'doc', giving the same behavior as TipTap's extension.
    */
  appendTo?: string;
  /**
   * The node types after which the trailing node should not be inserted.
   * @default ['paragraph']
   */
  notAfter?: string | string[];
}

/**
 * This extension allows you to add an extra node at the end of a node.
 *
 * Differently from TipTap's native one, it allows you to pick which node to append the trailing node to.
 * @see https://www.tiptap.dev/api/extensions/trailing-node
 */
export const TrailingNode = Extension.create<TrailingNodeOptions>({
  name: 'trailingNode',

  addOptions() {
    return {
      node: undefined,
      appendTo: 'doc',
      notAfter: [],
    };
  },

  addProseMirrorPlugins() {
    const plugin = new PluginKey(this.name);
    const defaultNode =
      this.options.node ||
      this.editor.schema.topNodeType.contentMatch.defaultType?.name ||
      'paragraph';

    const disabledNodes = Object.entries(this.editor.schema.nodes)
      .map(([, value]) => value)
      .filter((node) =>
        (this.options.notAfter || []).concat(defaultNode).includes(node.name),
      );

    const appendToType =
      this.editor.schema.nodes[this.options.appendTo || 'doc'];

    const getInsertPositions = (doc: Node): number[] => {
      const positions: number[] = [];

      if (doc.type === appendToType) {
        if (!nodeEqualsType({ node: doc.lastChild, types: disabledNodes })) {
          positions.push(doc.content.size);
        }
      }

      doc.descendants((node, pos) => {
        if (node.type !== appendToType) return;
        if (!nodeEqualsType({ node: node.lastChild, types: disabledNodes })) {
          positions.push(pos + node.nodeSize - 1);
        }
      });

      return positions;
    };

    return [
      new Plugin({
        key: plugin,
        appendTransaction: (transactions, __, state) => {
          const { doc, tr, schema } = state;
          const shouldInsert = plugin.getState(state);
          const type = schema.nodes[defaultNode];

          if (
            transactions.some((transaction) =>
              transaction.getMeta(skipTrailingNodeMeta),
            )
          ) {
            return;
          }

          if (!shouldInsert) {
            return;
          }

          const positions = getInsertPositions(doc);

          for (const pos of positions.sort((a, b) => b - a)) {
            tr.insert(pos, type.create());
          }

          return positions.length > 0 ? tr : undefined;
        },
        state: {
          init: (_, state) => {
            return getInsertPositions(state.doc).length > 0;
          },
          apply: (tr, value) => {
            if (!tr.docChanged) {
              return value;
            }

            // Ignore transactions from UniqueID extension to prevent infinite loops
            // when UniqueID adds IDs to newly inserted trailing nodes
            if (tr.getMeta('__uniqueIDTransaction')) {
              return value;
            }

            return getInsertPositions(tr.doc).length > 0;
          },
        },
      }),
    ];
  },
});
