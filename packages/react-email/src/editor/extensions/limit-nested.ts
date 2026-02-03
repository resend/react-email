import { Extension } from '@tiptap/core';
import type { NodeRange } from '@tiptap/pm/model';
import { Plugin, PluginKey } from '@tiptap/pm/state';

interface MaxNestingOptions {
  maxDepth: number;
  nodeTypes?: string[];
}

export const MaxNesting = Extension.create<MaxNestingOptions>({
  name: 'maxNesting',

  addOptions() {
    return {
      maxDepth: 3,
      nodeTypes: undefined,
    };
  },

  addProseMirrorPlugins() {
    const { maxDepth, nodeTypes } = this.options;

    if (typeof maxDepth !== 'number' || maxDepth < 1) {
      throw new Error('maxDepth must be a positive number');
    }

    return [
      new Plugin({
        key: new PluginKey('maxNesting'),

        appendTransaction(transactions, _oldState, newState) {
          const docChanged = transactions.some((tr) => tr.docChanged);
          if (!docChanged) {
            return null;
          }

          // Collect all ranges that need to be lifted
          const rangesToLift: { range: NodeRange; target: number }[] = [];

          newState.doc.descendants((node, pos) => {
            let depth = 0;
            let currentPos = pos;
            let currentNode = node;

            while (currentNode && depth <= maxDepth) {
              if (!nodeTypes || nodeTypes.includes(currentNode.type.name)) {
                depth++;
              }

              const $pos = newState.doc.resolve(currentPos);
              if ($pos.depth === 0) {
                break;
              }

              currentPos = $pos.before($pos.depth);
              currentNode = newState.doc.nodeAt(currentPos)!;
            }

            if (depth > maxDepth) {
              const $pos = newState.doc.resolve(pos);
              if ($pos.depth > 0) {
                const range = $pos.blockRange();
                if (
                  range &&
                  'canReplace' in newState.schema.nodes.doc &&
                  typeof newState.schema.nodes.doc.canReplace === 'function' &&
                  newState.schema.nodes.doc.canReplace(
                    range.start - 1,
                    range.end + 1,
                    newState.doc.slice(range.start, range.end).content,
                  )
                ) {
                  rangesToLift.push({ range, target: range.start - 1 });
                }
              }
            }
          });

          if (rangesToLift.length === 0) {
            return null;
          }

          // Process ranges in reverse order (end to start) to maintain position validity
          const tr = newState.tr;
          for (let i = rangesToLift.length - 1; i >= 0; i--) {
            const { range, target } = rangesToLift[i];
            tr.lift(range, target);
          }

          return tr;
        },

        filterTransaction(tr) {
          if (!tr.docChanged) {
            return true;
          }

          let wouldCreateDeepNesting = false;
          const newDoc = tr.doc;

          newDoc.descendants((node, pos) => {
            if (wouldCreateDeepNesting) {
              return false;
            }

            let depth = 0;
            let currentPos = pos;
            let currentNode = node;

            while (currentNode && depth <= maxDepth) {
              if (!nodeTypes || nodeTypes.includes(currentNode.type.name)) {
                depth++;
              }

              const $pos = newDoc.resolve(currentPos);
              if ($pos.depth === 0) {
                break;
              }

              currentPos = $pos.before($pos.depth);
              currentNode = newDoc.nodeAt(currentPos)!;
            }

            if (depth > maxDepth) {
              wouldCreateDeepNesting = true;
              return false;
            }
          });

          return !wouldCreateDeepNesting;
        },
      }),
    ];
  },
});
