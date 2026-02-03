import type { Editor } from '@tiptap/react';
import { NodeViewContent, NodeViewWrapper } from '@tiptap/react';
import * as React from 'react';
import * as Select from '@/ui/select';
import { useCustomVariables } from '../variables/use-custom-variables';
import {
  flattenObjectPaths,
  getLoopItemVariables,
  normalizeFallbackValue,
} from '../variables/utils';

interface ConditionalNodeProps {
  node: {
    attrs: Record<string, any>;
  };
  updateAttributes: (attrs: Record<string, unknown>) => void;
  editor: Editor;
  getPos: () => number | undefined;
}

export const ConditionalNode = ({
  node,
  updateAttributes,
  editor,
  getPos,
}: ConditionalNodeProps) => {
  const variablesContext = editor.storage.variable;

  const customVariables = useCustomVariables(variablesContext?.customVariables);

  const loopItemVariables = React.useMemo(
    () => getLoopItemVariables(editor, customVariables, getPos() ?? 0),
    [editor, customVariables, getPos],
  );

  const objectVariables = customVariables.filter(
    (variable: { type: string; fallback_value?: unknown }) =>
      variable.type === 'object',
  );
  const primitiveAndListVariables = customVariables.filter(
    (variable: { type: string }) => variable.type !== 'object',
  );

  const handleTestChange = (value: string) => {
    updateAttributes({
      test: value,
    });
  };

  const handleNegateChange = (negate: boolean) => {
    updateAttributes({
      negate,
    });
  };

  const hasVariablesToList =
    loopItemVariables.length > 0 ||
    objectVariables.length > 0 ||
    primitiveAndListVariables.length > 0;

  return (
    <NodeViewWrapper className="conditional-node">
      <div className="bg-gray-100 rounded-lg p-2 mb-2">
        <div className="flex items-center gap-2 text-sm font-mono">
          <span className="text-gray-600">IF</span>
          <Select.Root
            value={node.attrs.test || ''}
            onValueChange={handleTestChange}
          >
            <Select.Trigger
              size="2"
              appearance="ghost"
              className="max-w-64 w-fit"
              disabled={!hasVariablesToList}
            >
              <Select.Value placeholder="Select variable or property" />
            </Select.Trigger>

            <Select.Content>
              {hasVariablesToList ? (
                <>
                  {loopItemVariables.length > 0 && (
                    <Select.Group>
                      {loopItemVariables.map((path) => (
                        <Select.Item key={path} value={path}>
                          {`{{{${path}}}}`}
                        </Select.Item>
                      ))}
                    </Select.Group>
                  )}
                  {objectVariables.map(
                    (v: { key: string; fallback_value?: unknown }) => {
                      const normalized = normalizeFallbackValue(
                        v.fallback_value,
                      );
                      const nested = flattenObjectPaths(normalized, 2);
                      return (
                        <Select.Group key={v.key}>
                          {nested.map((p) => {
                            const full = `${v.key}.${p}`;
                            return (
                              <Select.Item key={full} value={full}>
                                {`{{{${full}}}}`}
                              </Select.Item>
                            );
                          })}
                        </Select.Group>
                      );
                    },
                  )}
                  {primitiveAndListVariables.map((v: { key: string }) => (
                    <Select.Group key={v.key}>
                      <Select.Item
                        value={v.key}
                      >{`{{{${v.key}}}}`}</Select.Item>
                    </Select.Group>
                  ))}
                </>
              ) : (
                <Select.Item value="no-variables-available" disabled>
                  No variables available
                </Select.Item>
              )}
            </Select.Content>
          </Select.Root>
          <span className="text-gray-600">is</span>
          <Select.Root
            value={node.attrs.negate ? 'false' : 'true'}
            onValueChange={(value) => handleNegateChange(value === 'false')}
          >
            <Select.Trigger size="2" appearance="ghost" className="max-w-24">
              <Select.Value placeholder="true" />
            </Select.Trigger>

            <Select.Content>
              <Select.Item value="true">truthy</Select.Item>
              <Select.Item value="false">falsy</Select.Item>
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
