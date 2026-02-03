import type { Editor } from '@tiptap/react';
import { NodeViewContent, NodeViewWrapper } from '@tiptap/react';
import * as React from 'react';
import * as Select from '@/ui/select';
import { useCustomVariables } from '../variables/use-custom-variables';
import {
  calculateLoopItemVariables,
  hasLoopStructureChanged,
} from '../variables/utils';

interface LoopNodeProps {
  node: {
    attrs: Record<string, any>;
  };
  updateAttributes: (attrs: Record<string, unknown>) => void;
  editor: Editor;
  getPos: () => number | undefined;
}

export const LoopNode = ({
  node,
  updateAttributes,
  editor,
  getPos,
}: LoopNodeProps) => {
  const variablesContext = editor.storage.variable;

  const [prevLoopItemVars, setPrevLoopItemVars] = React.useState<string[]>([]);

  const customVariables = useCustomVariables(variablesContext?.customVariables);

  const currentLoopItemVars = React.useMemo(() => {
    if (!node.attrs.list) {
      return [];
    }
    const listVariable = customVariables.find(
      (v: { key: string; type: string }) =>
        v.key === node.attrs.list && v.type === 'list',
    );
    return calculateLoopItemVariables(listVariable);
  }, [customVariables, node.attrs.list]);

  React.useEffect(() => {
    // Check if we need to clean up: either structural change or some old variables are no longer valid
    const needsCleanup =
      prevLoopItemVars.length > 0 &&
      (hasLoopStructureChanged(prevLoopItemVars, currentLoopItemVars) ||
        prevLoopItemVars.some(
          (oldVar) => !currentLoopItemVars.includes(oldVar),
        ));

    if (needsCleanup) {
      // Variables changed, clean up invalid descendants
      const pos = getPos();
      if (pos === undefined) {
        return;
      }

      const { tr, doc } = editor.state;
      const loopNode = doc.nodeAt(pos);
      if (!loopNode) {
        return;
      }

      let modified = false;

      loopNode.descendants((node, relativePos) => {
        const absolutePos = pos + relativePos + 1;

        // Clean up conditional nodes
        if (node.type.name === 'conditional' && node.attrs.test) {
          const testValue = node.attrs.test;
          if (
            typeof testValue === 'string' &&
            (testValue.startsWith('this.') || testValue === 'this') &&
            !currentLoopItemVars.includes(testValue)
          ) {
            // Map position through previous changes
            const mappedPos = tr.mapping.map(absolutePos);
            tr.setNodeMarkup(mappedPos, undefined, {
              ...node.attrs,
              test: '',
            });
            modified = true;
          }
        }

        // Clean up variable nodes with invalid {{{this...}}} references
        if (node.type.name === 'variable' && node.attrs.id) {
          const varId = node.attrs.id;

          // Extract variable name from {{{varName}}}
          const match = /^\{\{\{(this(?:\.\w+)*)\}\}\}$/.exec(varId);
          if (match) {
            const varName = match[1];

            if (!currentLoopItemVars.includes(varName)) {
              // Map position through previous changes in the transaction
              const mappedFrom = tr.mapping.map(absolutePos);
              const mappedTo = mappedFrom + node.nodeSize;
              tr.delete(mappedFrom, mappedTo);
              modified = true;
            }
          }
        }

        return true; // Continue traversal
      });

      if (modified) {
        editor.view.dispatch(tr);
      }
    }

    setPrevLoopItemVars(currentLoopItemVars);
  }, [currentLoopItemVars, prevLoopItemVars, editor, getPos]);

  const availableLists = customVariables.filter(
    (variable: { type: string; key: string; fallback_value?: any }) =>
      variable.type === 'list',
  );

  const handleListChange = (value: string) => {
    updateAttributes({
      list: value,
    });
  };

  const hasVariablesToList = availableLists.length > 0;

  return (
    <NodeViewWrapper className="loop-node">
      <div className="bg-gray-100 rounded-lg p-2 mb-2">
        <div className="flex items-center gap-2 text-sm font-mono">
          <span>FOR</span>
          <span className="text-sm font-mono">{'{{{this}}}'}</span>
          <span>IN</span>

          <Select.Root
            value={node.attrs.list || ''}
            onValueChange={handleListChange}
          >
            <Select.Trigger
              size="2"
              appearance="ghost"
              className="max-w-48 w-fit"
              disabled={!hasVariablesToList}
            >
              <Select.Value placeholder="Select a list" />
            </Select.Trigger>

            <Select.Content>
              {availableLists.length > 0 ? (
                availableLists.map((list: any) => (
                  <Select.Item key={list.key} value={list.key}>
                    {`{{{${list.key}}}}`}
                  </Select.Item>
                ))
              ) : (
                <Select.Item value="no-lists-available" disabled>
                  No lists available
                </Select.Item>
              )}
            </Select.Content>
          </Select.Root>
        </div>
      </div>

      <div className="outline-2 outline-dashed outline-gray-200 rounded-md p-2">
        <NodeViewContent />
      </div>
    </NodeViewWrapper>
  );
};
