'use client';

import { useDragToChange } from '../hooks/use-drag-to-change';
import { useNumericInput } from '../hooks/use-numeric-input';
import { Select, TextField } from '../primitives';

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
    <span data-re-inspector-number="">
      {icon && (
        <span className="pointer-events-none" aria-hidden>
          {icon}
        </span>
      )}
      <TextField
        value={displayValue}
        placeholder={placeholder}
        type="text"
        inputMode="numeric"
        data-type="number"
        {...handlers}
      />
      {hasUnitSelect ? (
        <Select.Root
          value={unit}
          onChange={(e) => onUnitChange(e.target.value)}
        >
          {unitOptions.map((opt) => (
            <Select.Item key={opt} value={opt}>
              {opt}
            </Select.Item>
          ))}
        </Select.Root>
      ) : (
        unit && (
          <span data-re-inspector-unit="" {...dragProps}>
            {unit}
          </span>
        )
      )}
    </span>
  );
}
