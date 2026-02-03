import { json } from '@codemirror/lang-json';
import { EditorView } from '@codemirror/view';
import CodeMirror from '@uiw/react-codemirror';
import { useTheme } from 'next-themes';
import * as React from 'react';
import { cn } from '@/lib/cn';
import type { VariableType } from '@/schemas/templates';
import { Button } from '@/ui/button';
import * as Dialog from '@/ui/dialog';
import { SHORTCUTS_VALUES } from '@/ui/kbd';
import { Label } from '@/ui/label';
import * as Select from '@/ui/select';
import { Text } from '@/ui/text';
import { TextField } from '@/ui/text-field';
import { showToast } from '@/ui/toast';
import { vesperInit } from '@/utils/codemirror-theme';
import type { CustomVariable, OnUpdateVariableHandler } from './extension';

type FallbackValueInputProps = {
  variableType: VariableType;
  fallbackValue: string;
  setFallbackValue: (value: string) => void;
  theme?: string;
};

function FallbackValueInput({
  variableType,
  fallbackValue,
  setFallbackValue,
  theme,
}: FallbackValueInputProps) {
  if (variableType === 'boolean') {
    return (
      <Select.Root value={fallbackValue} onValueChange={setFallbackValue}>
        <Select.Trigger id="fallback">
          <Select.Value placeholder="Select a value" />
        </Select.Trigger>
        <Select.Content>
          <Select.Item value="true">True</Select.Item>
          <Select.Item value="false">False</Select.Item>
        </Select.Content>
      </Select.Root>
    );
  }

  if (variableType === 'object' || variableType === 'list') {
    return (
      <CodeMirror
        id="fallback"
        value={fallbackValue}
        onChange={setFallbackValue}
        placeholder={
          variableType === 'object'
            ? '{"key": "value", "nested": {"field": 123}}'
            : '["Item 1", "Item 2"]'
        }
        extensions={[json(), EditorView.lineWrapping]}
        basicSetup={{
          foldGutter: false,
          highlightActiveLine: false,
          highlightActiveLineGutter: false,
          lineNumbers: false,
          searchKeymap: false,
        }}
        theme={vesperInit({
          theme: theme === 'dark' ? 'dark' : 'light',
          settings: {
            background: 'var(--gray-a2)',
            gutterBackground: 'transparent',
            lineHighlight: 'transparent',
          },
        })}
        className={cn(
          'bg-gray-a2 border border-gray-a3 placeholder:text-gray-7 text-gray-a10 focus-visible:ring-2 focus-visible:ring-gray-a3 w-full resize-none rounded-xl outline-hidden overflow-hidden',
          'focus-within:ring-gray-a2 focus-within:ring-2',
          '[&_.cm-editor]:outline-hidden [&_.cm-scroller]:px-1.5 [&_.cm-scroller]:py-0.5',
        )}
      />
    );
  }

  if (variableType === 'number') {
    return (
      <TextField.Input
        id="fallback"
        type="number"
        value={fallbackValue}
        onChange={(e) => setFallbackValue(e.target.value)}
        placeholder="0"
        className="text-gray-9 no-spinner"
      />
    );
  }

  return (
    <TextField.Input
      id="fallback"
      type="text"
      value={fallbackValue}
      onChange={(e) => setFallbackValue(e.target.value)}
      placeholder="Value that appears if the variable is empty"
      className="text-gray-9"
    />
  );
}

const DEFAULT_INPUT_WIDTH = 111;

interface EditVariableModalProps {
  variable: {
    displayKey: string;
    variableKey: string;
    fallbackValue: string | null;
  };
  customVariables?: CustomVariable[] | null;
  popup?: InstanceType<any> | null;
  children?: React.ReactNode;
  onUpdateVariable: OnUpdateVariableHandler;
  onRequestDelete: () => void;
}

export function EditVariableModal({
  variable,
  customVariables,
  popup,
  children,
  onUpdateVariable,
  onRequestDelete,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  hideOverlay,
}: EditVariableModalProps & {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  hideOverlay?: boolean;
}) {
  const [internalOpen, setInternalOpen] = React.useState(false);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled
    ? (controlledOnOpenChange ?? (() => {}))
    : setInternalOpen;

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    // Close the tippy popup when opening the edit modal
    if (newOpen && popup?.[0]) {
      popup[0].hide();
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      {children ? <Dialog.Trigger asChild>{children}</Dialog.Trigger> : null}
      <Dialog.Content hideOverlay={hideOverlay}>
        <EditVariableModalContent
          variable={variable}
          customVariables={customVariables}
          onOpenChange={setOpen}
          onUpdateVariable={onUpdateVariable}
          onRequestDelete={onRequestDelete}
        />
      </Dialog.Content>
    </Dialog.Root>
  );
}

type EditVariableModalContentProps = {
  variable: {
    displayKey: string;
    variableKey: string;
    fallbackValue: string | null;
  };
  customVariables?: CustomVariable[] | null;
  onOpenChange: (open: boolean) => void;
  onUpdateVariable: OnUpdateVariableHandler;
  onRequestDelete: () => void;
};

function EditVariableModalContent({
  variable,
  customVariables,
  onOpenChange,
  onUpdateVariable,
  onRequestDelete,
}: EditVariableModalContentProps) {
  const { resolvedTheme } = useTheme();

  // Extract the base variable key (handle nested paths like "MY_OBJECT.path")
  const baseVariableKey = variable.displayKey.split('.')[0];

  // Find the full variable data from customVariables
  const fullVariable = React.useMemo(() => {
    if (!customVariables) {
      return null;
    }
    return customVariables.find((v) => v.key === baseVariableKey);
  }, [customVariables, baseVariableKey]);

  const [variableName, setVariableName] =
    React.useState<string>(baseVariableKey);
  const [variableType, setVariableType] = React.useState<VariableType>(
    (fullVariable?.type as VariableType) || 'string',
  );
  const [fallbackValue, setFallbackValue] = React.useState<string>(
    variable.fallbackValue || '',
  );
  const inputRef = React.useRef<HTMLInputElement>(null);
  const measureElementRef = React.useRef<HTMLSpanElement>(null);
  const [textWidth, setTextWidth] = React.useState(DEFAULT_INPUT_WIDTH);
  const prevVariableKeyRef = React.useRef(variable.variableKey);

  // Initialize form fields when variable changes
  React.useEffect(() => {
    if (prevVariableKeyRef.current === variable.variableKey) {
      return;
    }

    prevVariableKeyRef.current = variable.variableKey;

    if (fullVariable?.fallback_value !== undefined && fullVariable !== null) {
      setFallbackValue(fullVariable.fallback_value ?? '');
    } else if (variable.fallbackValue !== null) {
      setFallbackValue(variable.fallbackValue);
    }

    if (fullVariable?.key) {
      setVariableName(fullVariable.key);
    } else if (baseVariableKey) {
      setVariableName(baseVariableKey);
    }

    if (fullVariable?.type) {
      setVariableType(fullVariable.type as VariableType);
    }
  }, [
    variable.variableKey,
    variable.fallbackValue,
    fullVariable,
    baseVariableKey,
  ]);

  React.useEffect(() => {
    if (variableName && measureElementRef.current) {
      const width = measureElementRef.current.offsetWidth;
      setTextWidth(width);
    } else {
      setTextWidth(DEFAULT_INPUT_WIDTH);
    }
  }, [variableName]);

  const isFormValid =
    variableName.trim().length > 0 &&
    variableType &&
    (variableType !== 'object' && variableType !== 'list'
      ? true
      : fallbackValue.trim().length > 0);

  const [isUpdating, setIsUpdating] = React.useState(false);

  const handleSubmit = async () => {
    if (!isFormValid) {
      showToast({
        title: 'Please fill in all required fields',
        appearance: 'red',
      });
      return;
    }

    setIsUpdating(true);
    try {
      await onUpdateVariable(baseVariableKey, {
        variableKey: variableName,
        type: variableType,
        fallbackValue,
      });
      onOpenChange(false);
      showToast({
        title: 'Variable updated',
        appearance: 'green',
      });
    } catch (error) {
      showToast({
        title: (error as Error).message,
        appearance: 'red',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <>
      {/* Invisible element for measuring text width */}
      <span
        ref={measureElementRef}
        className="absolute invisible text-base sm:text-sm max-w-100 truncate whitespace-pre"
        aria-hidden="true"
      >
        {variableName}
      </span>

      <Dialog.Title>Edit Variable</Dialog.Title>

      <div
        className="mt-6 flex flex-col gap-7"
        onKeyDownCapture={handleKeyDown}
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col gap-2">
          <Label htmlFor="name">Name</Label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-6 select-none font-mono z-10 pointer-events-none tracking-[-0.15rem] text-sm">
              {'{{{'}
            </div>
            <TextField.Input
              ref={inputRef}
              id="name"
              value={variableName}
              onChange={(e) => setVariableName(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
              placeholder="YOUR_VARIABLE"
              className="pr-16"
              style={{
                paddingLeft: '35px', // 12px base + 18px for "{{{" width + 5px gap
                paddingRight: '35px', // 5px gap + 18px for "}}}" width + 12px base padding
              }}
            />
            <div
              className="absolute top-1/2 -translate-y-1/2 text-gray-6 select-none font-mono z-10 pointer-events-none tracking-[-0.15rem] text-sm"
              style={{
                // Position right after text content with 5px gap, capped at input width - 35px
                left: `${Math.min(35 + textWidth + 5, inputRef.current?.offsetWidth ? inputRef.current.offsetWidth - 32 : 35 + textWidth + 5)}px`,
              }}
            >
              {'}}}'}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="type">Type</Label>
          <div
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <Select.Root
              value={variableType}
              onValueChange={(value) => setVariableType(value as VariableType)}
            >
              <Select.Trigger id="type">
                <Select.Value />
              </Select.Trigger>
              <Select.Content>
                <Select.Item value="string">String</Select.Item>
                <Select.Item value="number">Number</Select.Item>
              </Select.Content>
            </Select.Root>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="fallback">Fallback value</Label>
          <div
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <FallbackValueInput
              variableType={variableType}
              fallbackValue={fallbackValue}
              setFallbackValue={setFallbackValue}
              theme={resolvedTheme}
            />
          </div>
        </div>

        <div className="min-h-px w-full bg-gray-3" />

        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <Text color="white" size="2" weight="semibold">
              Delete variable
            </Text>
            <Text color="gray" size="2">
              This can not be undone
            </Text>
          </div>

          <Button appearance="red" onClick={onRequestDelete}>
            Delete
          </Button>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <Button
            appearance="white"
            state={
              isFormValid ? (isUpdating ? 'loading' : 'normal') : 'disabled'
            }
            shortcut={[SHORTCUTS_VALUES.CMD, SHORTCUTS_VALUES.ENTER]}
            onClick={handleSubmit}
          >
            Save
          </Button>

          <Dialog.Close asChild>
            <Button appearance="gray" shortcut={SHORTCUTS_VALUES.ESC}>
              Cancel
            </Button>
          </Dialog.Close>
        </div>
      </div>
    </>
  );
}
