import type { ComponentProps } from 'react';
import { TextField } from '../primitives';

interface TextInputProps
  extends Omit<
    ComponentProps<'input'>,
    'className' | 'size' | 'type' | 'onChange'
  > {
  onChange: (value: string) => void;
}

export function TextInput({ onChange, ...props }: TextInputProps) {
  return (
    <TextField.Root>
      <TextField.Input
        {...props}
        onChange={(event) => onChange(event.target.value)}
        className="p-[0.85rem]"
        size="1"
        type="text"
      />
    </TextField.Root>
  );
}
