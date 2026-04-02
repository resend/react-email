'use client';

import * as React from 'react';
import {
  PanelBottomIcon,
  PanelLeftIcon,
  PanelRightIcon,
  PanelTopIcon,
  SquareDashedIcon,
  SquareIcon,
} from '../../icons';
import { useDragToChange } from '../hooks/use-drag-to-change';
import { useNumericInput } from '../hooks/use-numeric-input';
import { Label, Text, TextField, ToggleGroup, Tooltip } from '../primitives';
import { PropRow } from './prop-row';

interface PaddingValues {
  paddingTop: number;
  paddingRight: number;
  paddingBottom: number;
  paddingLeft: number;
}

interface PaddingPickerProps {
  value: Partial<PaddingValues>;
  onChange: (values: Partial<PaddingValues>) => void;
  unit?: 'px' | '%';
}

export function PaddingPicker({
  value,
  onChange,
  unit = 'px',
}: PaddingPickerProps) {
  const allEqual =
    value.paddingTop === value.paddingBottom &&
    value.paddingTop === value.paddingLeft &&
    value.paddingTop === value.paddingRight;

  const [expanded, setExpanded] = React.useState(!allEqual);

  const handleChange = (key: keyof PaddingValues, newValue: number) => {
    onChange({
      paddingTop: value.paddingTop ?? 0,
      paddingRight: value.paddingRight ?? 0,
      paddingBottom: value.paddingBottom ?? 0,
      paddingLeft: value.paddingLeft ?? 0,
      [key]: newValue,
    });
  };

  const handleUniformChange = (newValue: number) => {
    onChange({
      paddingTop: newValue,
      paddingRight: newValue,
      paddingBottom: newValue,
      paddingLeft: newValue,
    });
  };

  const handleModeChange = (mode: string | string[]) => {
    const m = Array.isArray(mode) ? mode[0] : mode;
    if (m === 'uniform' && expanded) {
      const uniform = value.paddingTop ?? 0;
      onChange({
        paddingTop: uniform,
        paddingRight: uniform,
        paddingBottom: uniform,
        paddingLeft: uniform,
      });
      setExpanded(false);
    } else if (m === 'individual' && !expanded) {
      setExpanded(true);
    }
  };

  if (expanded) {
    return (
      <div className="flex flex-col gap-2">
        <PropRow>
          <Label>Padding</Label>
          <ToggleGroup.Root value="individual" onValueChange={handleModeChange}>
            <Tooltip.Root delayDuration={0}>
              <Tooltip.Trigger asChild>
                <ToggleGroup.Item value="uniform">
                  <SquareIcon className="size-4!" />
                </ToggleGroup.Item>
              </Tooltip.Trigger>
              <Tooltip.Content>Uniform</Tooltip.Content>
            </Tooltip.Root>
            <Tooltip.Root delayDuration={0}>
              <Tooltip.Trigger asChild>
                <ToggleGroup.Item value="individual">
                  <SquareDashedIcon className="size-4!" />
                </ToggleGroup.Item>
              </Tooltip.Trigger>
              <Tooltip.Content>Per side</Tooltip.Content>
            </Tooltip.Root>
          </ToggleGroup.Root>
        </PropRow>

        <div className="flex flex-col items-center gap-1.5">
          <div className="flex items-center gap-1">
            <PaddingInput
              icon={<PanelTopIcon className="size-3.5" />}
              value={value.paddingTop}
              onChange={(v) => handleChange('paddingTop', v)}
              unit={unit}
              placeholder="T"
            />
            <PaddingInput
              icon={<PanelRightIcon className="size-3.5" />}
              value={value.paddingRight}
              onChange={(v) => handleChange('paddingRight', v)}
              unit={unit}
              placeholder="R"
            />
          </div>
          <div className="flex items-center gap-1">
            <PaddingInput
              icon={<PanelBottomIcon className="size-3.5" />}
              value={value.paddingBottom}
              onChange={(v) => handleChange('paddingBottom', v)}
              unit={unit}
              placeholder="B"
            />
            <PaddingInput
              icon={<PanelLeftIcon className="size-3.5" />}
              value={value.paddingLeft}
              onChange={(v) => handleChange('paddingLeft', v)}
              unit={unit}
              placeholder="L"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <PropRow>
      <Label>Padding</Label>

      <div className="flex items-center gap-1">
        <UniformInput
          value={value.paddingTop}
          onChange={handleUniformChange}
          unit={unit}
        />
        <ToggleGroup.Root
          value="uniform"
          onValueChange={handleModeChange}
          className="w-[72px]"
        >
          <Tooltip.Root delayDuration={0}>
            <Tooltip.Trigger asChild>
              <ToggleGroup.Item value="uniform" className="flex-1">
                <SquareIcon className="size-4!" />
              </ToggleGroup.Item>
            </Tooltip.Trigger>
            <Tooltip.Content>Uniform</Tooltip.Content>
          </Tooltip.Root>
          <Tooltip.Root delayDuration={0}>
            <Tooltip.Trigger asChild>
              <ToggleGroup.Item value="individual" className="flex-1">
                <SquareDashedIcon className="size-4!" />
              </ToggleGroup.Item>
            </Tooltip.Trigger>
            <Tooltip.Content>Per side</Tooltip.Content>
          </Tooltip.Root>
        </ToggleGroup.Root>
      </div>
    </PropRow>
  );
}

interface PaddingInputProps {
  icon?: React.ReactNode;
  value: number | undefined;
  onChange: (value: number) => void;
  placeholder?: string;
  unit: string;
}

function PaddingInput({
  icon,
  value,
  onChange,
  placeholder,
  unit,
}: PaddingInputProps) {
  const onCommit = (v: number | '') => onChange(v === '' ? 0 : v);
  const { displayValue, ...handlers } = useNumericInput({
    value,
    onCommit,
    allowEmpty: false,
    min: 0,
  });

  const { dragProps } = useDragToChange({
    value,
    onCommit,
    min: 0,
  });

  return (
    <TextField.Root className="min-w-0 flex-1">
      {icon && (
        <TextField.Slot>
          <span className="pointer-events-none text-gray-8 pl-1">{icon}</span>
        </TextField.Slot>
      )}

      <TextField.Input
        type="text"
        inputMode="numeric"
        value={displayValue}
        placeholder={placeholder}
        className="h-7 font-mono"
        {...handlers}
      />
      <TextField.Slot>
        <Text size="1" color="gray" className="font-mono pr-2" {...dragProps}>
          {unit}
        </Text>
      </TextField.Slot>
    </TextField.Root>
  );
}

function UniformInput({
  value,
  onChange,
  unit,
}: {
  value: number | undefined;
  onChange: (value: number) => void;
  unit: string;
}) {
  const onCommit = (v: number | '') => onChange(v === '' ? 0 : v);
  const { displayValue, ...handlers } = useNumericInput({
    value,
    onCommit,
    allowEmpty: false,
    min: 0,
  });

  const { dragProps } = useDragToChange({
    value,
    onCommit,
    min: 0,
  });

  return (
    <TextField.Root className="min-w-0 flex-1">
      <TextField.Input
        type="text"
        inputMode="numeric"
        value={displayValue}
        className="h-7 font-mono"
        {...handlers}
      />
      <TextField.Slot>
        <Text size="1" color="gray" className="w-5 font-mono" {...dragProps}>
          {unit}
        </Text>
      </TextField.Slot>
    </TextField.Root>
  );
}
