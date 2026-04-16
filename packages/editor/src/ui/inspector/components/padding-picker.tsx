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
import { Label, TextField, ToggleGroup, Tooltip } from '../primitives';
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

  const handleModeChange = (mode: string) => {
    if (mode === 'uniform' && expanded) {
      const uniform = value.paddingTop ?? 0;
      onChange({
        paddingTop: uniform,
        paddingRight: uniform,
        paddingBottom: uniform,
        paddingLeft: uniform,
      });
      setExpanded(false);
    } else if (mode === 'individual' && !expanded) {
      setExpanded(true);
    }
  };

  const modeToggle = (
    <ToggleGroup.Root
      value={expanded ? 'individual' : 'uniform'}
      onValueChange={handleModeChange}
    >
      <Tooltip.Root>
        <Tooltip.Trigger>
          <ToggleGroup.Item value="uniform">
            <SquareIcon size={16} />
          </ToggleGroup.Item>
        </Tooltip.Trigger>
        <Tooltip.Content>Uniform</Tooltip.Content>
      </Tooltip.Root>
      <Tooltip.Root>
        <Tooltip.Trigger>
          <ToggleGroup.Item value="individual">
            <SquareDashedIcon size={16} />
          </ToggleGroup.Item>
        </Tooltip.Trigger>
        <Tooltip.Content>Per side</Tooltip.Content>
      </Tooltip.Root>
    </ToggleGroup.Root>
  );

  if (expanded) {
    return (
      <div className="flex flex-col gap-2">
        <PropRow>
          <Label>Padding</Label>
          {modeToggle}
        </PropRow>

        <div className="flex flex-col items-center gap-1.5">
          <div className="flex items-center gap-1">
            <PaddingInput
              icon={<PanelTopIcon size={14} />}
              value={value.paddingTop}
              onChange={(v) => handleChange('paddingTop', v)}
              unit={unit}
            />
            <PaddingInput
              icon={<PanelRightIcon size={14} />}
              value={value.paddingRight}
              onChange={(v) => handleChange('paddingRight', v)}
              unit={unit}
            />
          </div>
          <div className="flex items-center gap-1">
            <PaddingInput
              icon={<PanelBottomIcon size={14} />}
              value={value.paddingBottom}
              onChange={(v) => handleChange('paddingBottom', v)}
              unit={unit}
            />
            <PaddingInput
              icon={<PanelLeftIcon size={14} />}
              value={value.paddingLeft}
              onChange={(v) => handleChange('paddingLeft', v)}
              unit={unit}
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
        <PaddingInput
          value={value.paddingTop}
          onChange={handleUniformChange}
          unit={unit}
        />
        {modeToggle}
      </div>
    </PropRow>
  );
}

function PaddingInput({
  icon,
  value,
  onChange,
  unit,
}: {
  icon?: React.ReactNode;
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
    <span data-re-inspector-number="">
      {icon && (
        <span className="pointer-events-none" aria-hidden>
          {icon}
        </span>
      )}
      <TextField
        type="text"
        inputMode="numeric"
        data-type="number"
        value={displayValue}
        {...handlers}
      />
      <span data-re-inspector-unit="" {...dragProps}>
        {unit}
      </span>
    </span>
  );
}
