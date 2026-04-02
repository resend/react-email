import { useDragToChange } from '../hooks/use-drag-to-change';
import { useNumericInput } from '../hooks/use-numeric-input';
import { Select, Text, TextField } from '../primitives';

interface NumberInputProps {
  icon?: React.ReactNode;
  value: string | number;
  onChange: (value: number | '') => void;
  placeholder?: string;
  unit?: 'px' | '%';
  min?: number;
  unitOptions?: string[];
  onUnitChange?: (unit: string) => void;
}

export function NumberInput({
  icon,
  value,
  onChange,
  placeholder,
  unit,
  min,
  unitOptions,
  onUnitChange,
}: NumberInputProps) {
  const { displayValue, ...handlers } = useNumericInput({
    value,
    onCommit: onChange,
    min,
    fallbackValue: placeholder ? Number(placeholder) : undefined,
  });

  const { dragProps } = useDragToChange({
    value,
    onCommit: onChange,
    min,
  });

  const hasUnitSelect = unitOptions && unitOptions.length > 1 && onUnitChange;

  return (
    <TextField.Root>
      {icon && (
        <TextField.Slot>
          <span className="pointer-events-none text-gray-8">{icon}</span>
        </TextField.Slot>
      )}
      <TextField.Input
        className="p-[0.85rem] font-mono"
        value={displayValue}
        placeholder={placeholder}
        type="text"
        inputMode="numeric"
        {...handlers}
      />
      {hasUnitSelect ? (
        <TextField.Slot>
          <Select.Root value={unit} onValueChange={onUnitChange}>
            <Select.Trigger
              appearance="ghost"
              size="1"
              className="h-5 min-w-0 w-auto gap-0 pl-1 pr-0 font-mono text-[11px] text-gray-9"
            >
              <Select.Value />
            </Select.Trigger>
            <Select.Content align="end">
              {unitOptions.map((opt) => (
                <Select.Item key={opt} value={opt}>
                  {opt}
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Root>
        </TextField.Slot>
      ) : (
        unit && (
          <TextField.Slot>
            <Text className="mr-2 font-mono" size="1" {...dragProps}>
              {unit}
            </Text>
          </TextField.Slot>
        )
      )}
    </TextField.Root>
  );
}
