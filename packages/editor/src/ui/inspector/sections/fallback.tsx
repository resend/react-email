import { editorEventBus } from '@react-email/editor/core';
import { useCurrentEditor } from '@tiptap/react';
import * as React from 'react';
import { useClientFeatureFlag } from '@/components/feature-flag-client';
import type { VariableType } from '@/schemas/templates';
import { Button } from '@/ui/button';
import { Label } from '@/ui/label';
import * as Select from '@/ui/select';
import { Text } from '@/ui/text';
import { FallbackValueInput } from '../../../../plugins/variables/fallback-value-input';
import type {
  VariableData,
  VariableItem,
} from '../../../../plugins/variables/types';
import { PropRow } from '../components/prop-row';
import { Section } from '../components/section';

interface FallbackSectionProps {
  variableId: string;
  fallbackValue: string;
}

export function FallbackSection({
  variableId,
  fallbackValue,
}: FallbackSectionProps) {
  const { editor } = useCurrentEditor();
  const enableTemplateLanguage = useClientFeatureFlag('enableTemplateLanguage');
  const [localFallback, setLocalFallback] = React.useState(fallbackValue);

  const data: VariableData | null = editor?.storage?.variable?.data ?? null;

  const isLoopVariable = /^\{\{\{this(\..+)?\}\}\}$/.test(variableId);

  const variableItem: VariableItem | undefined = data?.variables?.find(
    (v) => v.id === variableId,
  );
  const category = data?.categories?.find(
    (c) => c.id === variableItem?.category,
  );

  const variableKey =
    variableItem?.variableKey ?? (isLoopVariable ? 'loop-item' : '');
  const displayKey =
    variableItem?.displayKey ??
    (isLoopVariable ? variableId.replace(/^\{\{\{|\}\}\}$/g, '') : '');

  const skipWarning =
    isLoopVariable ||
    variableItem?.skipFallbackWarning ||
    category?.skipFallbackWarning ||
    false;
  const showWarning = localFallback === '' && !skipWarning;

  const canEditTypeAndDelete = isLoopVariable
    ? false
    : (category?.editable ?? false);

  const [localType, setLocalType] = React.useState<VariableType | null>(null);
  const serverType: VariableType =
    (variableItem?.type as VariableType) ?? 'string';
  const variableType = localType ?? serverType;

  React.useEffect(() => {
    setLocalType(null);
  }, [variableId]);

  const handleTypeChange = (newType: VariableType) => {
    setLocalType(newType);

    if (editor?.storage?.variable?.data) {
      const currentData = editor.storage.variable.data as VariableData;
      editor.storage.variable.data = {
        ...currentData,
        variables: currentData.variables.map((v) =>
          v.id === variableId ? { ...v, type: newType } : v,
        ),
      };
    }

    editorEventBus.dispatch('variable:update-type', {
      variableKey,
      type: newType,
    });
  };

  const handleDelete = () => {
    editorEventBus.dispatch('variable:delete-requested', {
      displayKey,
      variableKey,
      fallbackValue: localFallback,
    });
  };

  const previousFallbackRef = React.useRef(fallbackValue);

  const localFallbackRef = React.useRef(fallbackValue);
  const flushContextRef = React.useRef({
    canEditTypeAndDelete,
    displayKey,
    variableKey,
  });

  React.useEffect(() => {
    localFallbackRef.current = localFallback;
    flushContextRef.current = { canEditTypeAndDelete, displayKey, variableKey };
  });

  React.useEffect(() => {
    return function dispatchOnUnmount() {
      const currentValue = localFallbackRef.current;
      const previousValue = previousFallbackRef.current;

      if (currentValue === previousValue) {
        return;
      }

      const ctx = flushContextRef.current;

      if (ctx.canEditTypeAndDelete) {
        editorEventBus.dispatch('variable:update-fallback', {
          displayKey: ctx.displayKey,
          variableKey: ctx.variableKey,
          fallbackValue: currentValue,
        });
      } else {
        editorEventBus.dispatch('variable:fallback-updated', {
          variableKey: ctx.variableKey,
          fallbackValue: currentValue,
          originalValue: previousValue,
        });
      }
    };
  }, [variableId]);

  React.useEffect(() => {
    setLocalFallback(fallbackValue);
    previousFallbackRef.current = fallbackValue;
  }, [fallbackValue, variableId]);

  const handleChange = (newValue: string) => {
    setLocalFallback(newValue);

    if (!editor) {
      return;
    }

    // Update all variable instances in the document immediately for live visual feedback
    const tr = editor.state.tr;
    let updated = false;

    editor.state.doc.descendants((node, pos) => {
      if (node.type.name === 'variable' && node.attrs.id === variableId) {
        tr.setNodeMarkup(pos, undefined, {
          ...node.attrs,
          fallback: newValue,
        });
        updated = true;
      }
    });

    if (updated) {
      editor.view.dispatch(tr);
    }
  };

  const handleBlur = () => {
    const newValue = localFallback;
    const currentFallbackValue = previousFallbackRef.current;

    // Skip API call if value hasn't changed
    if (newValue === currentFallbackValue) {
      return;
    }

    if (canEditTypeAndDelete) {
      // For editable variables, update fallback without opening the edit modal
      editorEventBus.dispatch('variable:update-fallback', {
        displayKey,
        variableKey,
        fallbackValue: newValue,
      });
    } else {
      // For non-editable variables (contact properties, system vars), just dispatch update
      editorEventBus.dispatch('variable:fallback-updated', {
        variableKey,
        fallbackValue: newValue,
        originalValue: currentFallbackValue,
      });
    }

    previousFallbackRef.current = newValue;
  };

  const isNonEditableWithSkipWarning = skipWarning && !canEditTypeAndDelete;

  const isLoopContextVariable = variableId?.includes('{{{this');
  if (isLoopContextVariable) {
    return (
      <Section>
        <Text size="1" color="gray" className="mt-2 block">
          Loop context variables use the value from the current iteration.
        </Text>
      </Section>
    );
  }

  if (isNonEditableWithSkipWarning && variableItem) {
    return (
      <Section>
        <Text size="1" color="gray" className="mt-2 block">
          System variables cannot have fallback values.
        </Text>
      </Section>
    );
  }

  return (
    <Section>
      <PropRow className="flex-col items-start gap-2 [&>label]:mt-0">
        <Label htmlFor="fallback-input">Fallback value</Label>
        <FallbackValueInput
          variableType={variableType}
          value={localFallback}
          onChange={handleChange}
          onBlur={handleBlur}
          id="fallback-input"
        />
        {showWarning && (
          <Text size="1" color="gray" className="block">
            In case the variable is empty, this fallback value will be used.
          </Text>
        )}
      </PropRow>

      {canEditTypeAndDelete && (
        <>
          <PropRow className="flex-col items-start gap-2 [&>label]:mt-0">
            <Label>Type</Label>
            <Select.Root value={variableType} onValueChange={handleTypeChange}>
              <Select.Trigger className="w-full">
                <Select.Value />
              </Select.Trigger>
              <Select.Content>
                <Select.Item value="string">String</Select.Item>
                <Select.Item value="number">Number</Select.Item>
                {enableTemplateLanguage && (
                  <>
                    <Select.Item value="boolean">Boolean</Select.Item>
                    <Select.Item value="object">Object</Select.Item>
                    <Select.Item value="list">List</Select.Item>
                  </>
                )}
              </Select.Content>
            </Select.Root>
          </PropRow>

          <PropRow className="flex-col items-start gap-2 [&>label]:mt-0">
            <Label>Delete</Label>
            <Button appearance="red" className="w-full" onClick={handleDelete}>
              Delete variable
            </Button>
          </PropRow>
        </>
      )}
    </Section>
  );
}
