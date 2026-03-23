import { editorEventBus } from '@react-email/editor/core';
import { useCurrentEditor } from '@tiptap/react';
import type { ComponentProps } from 'react';
import { TextField } from '@/ui/text-field';
import { VariablesDropdown } from '../../../../plugins/variables/dropdown';

interface TextInputProps
  extends Omit<
    ComponentProps<'input'>,
    'className' | 'size' | 'type' | 'onChange'
  > {
  enableVariables?: boolean;
  onChange: (value: string) => void;
}

export function TextInput({
  enableVariables,
  onChange,
  ...props
}: TextInputProps) {
  const { editor } = useCurrentEditor();

  return (
    <TextField.Root>
      <TextField.Input
        {...props}
        onChange={(event) => onChange(event.target.value)}
        className="p-[0.85rem]"
        size="1"
        type="text"
      />

      {enableVariables && editor && (
        <TextField.Slot>
          <VariablesDropdown
            onVariableSelect={onChange}
            onCreateVariable={() => {
              // Open modal without auto-injection
              editorEventBus.dispatch('variable:create-requested', {
                source: null,
              });
            }}
          />
        </TextField.Slot>
      )}
    </TextField.Root>
  );
}
