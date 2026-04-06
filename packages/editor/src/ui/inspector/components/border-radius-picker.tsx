'use client';

import * as React from 'react';
import {
  CornerBottomLeftIcon,
  CornerBottomRightIcon,
  CornerTopLeftIcon,
  CornerTopRightIcon,
  SquareDashedIcon,
  SquareIcon,
} from '../../icons';
import { useDragToChange } from '../hooks/use-drag-to-change';
import { useNumericInput } from '../hooks/use-numeric-input';
import { Label, TextField, ToggleGroup, Tooltip } from '../primitives';
import { PropRow } from './prop-row';

interface BorderRadiusPickerProps {
  value: string | number;
  onChange: (values: string) => void;
  unit?: 'px' | '%';
}

export function BorderRadiusPicker({
  value,
  onChange,
  unit = 'px',
}: BorderRadiusPickerProps) {
  const expandedValues = expandShorthand(value);
  const allEqual = Object.values(expandedValues).every(
    (v) => v === expandedValues.borderTopLeftRadius,
  );

  const [expanded, setExpanded] = React.useState(!allEqual);

  const handleModeChange = (mode: string) => {
    if (mode === 'uniform' && expanded) {
      const uniform =
        expandedValues.borderTopLeftRadius ??
        expandedValues.borderTopRightRadius ??
        expandedValues.borderBottomRightRadius ??
        expandedValues.borderBottomLeftRadius ??
        0;
      onChange(`${uniform}${unit}`);
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
        <Tooltip.Content>Per corner</Tooltip.Content>
      </Tooltip.Root>
    </ToggleGroup.Root>
  );

  if (expanded) {
    return (
      <div className="flex flex-col gap-2">
        <PropRow>
          <Label>Rounded</Label>
          {modeToggle}
        </PropRow>

        <div className="flex flex-col items-center gap-1.5">
          <div className="flex items-center gap-1.5">
            <RadiusInput
              icon={<CornerTopLeftIcon size={14} />}
              value={expandedValues.borderTopLeftRadius}
              onChange={(v) =>
                onChange(
                  collapseToShorthand({
                    ...expandedValues,
                    borderTopLeftRadius: v,
                    unit,
                  }),
                )
              }
              unit={unit}
            />
            <RadiusInput
              icon={<CornerTopRightIcon size={14} />}
              value={expandedValues.borderTopRightRadius}
              onChange={(v) =>
                onChange(
                  collapseToShorthand({
                    ...expandedValues,
                    borderTopRightRadius: v,
                    unit,
                  }),
                )
              }
              unit={unit}
            />
          </div>
          <div className="flex items-center gap-1.5">
            <RadiusInput
              icon={<CornerBottomLeftIcon size={14} />}
              value={expandedValues.borderBottomLeftRadius}
              onChange={(v) =>
                onChange(
                  collapseToShorthand({
                    ...expandedValues,
                    borderBottomLeftRadius: v,
                    unit,
                  }),
                )
              }
              unit={unit}
            />
            <RadiusInput
              icon={<CornerBottomRightIcon size={14} />}
              value={expandedValues.borderBottomRightRadius}
              onChange={(v) =>
                onChange(
                  collapseToShorthand({
                    ...expandedValues,
                    borderBottomRightRadius: v,
                    unit,
                  }),
                )
              }
              unit={unit}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <PropRow>
      <Label>Rounded</Label>
      <div className="flex items-center gap-1">
        <RadiusInput
          value={expandedValues.borderTopLeftRadius}
          onChange={(v) => onChange(`${v}${unit}`)}
          unit={unit}
        />
        {modeToggle}
      </div>
    </PropRow>
  );
}

function RadiusInput({
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

function expandShorthand(value: string | number): {
  borderTopLeftRadius: number;
  borderTopRightRadius: number;
  borderBottomRightRadius: number;
  borderBottomLeftRadius: number;
} {
  if (typeof value === 'number') {
    return {
      borderTopLeftRadius: value,
      borderTopRightRadius: value,
      borderBottomRightRadius: value,
      borderBottomLeftRadius: value,
    };
  }

  const [topLeft, topRight, bottomRight, bottomLeft] = value
    .split(' ')
    .map((v) => Number.parseInt(v, 10));

  return {
    borderTopLeftRadius: topLeft,
    borderTopRightRadius: topRight ?? topLeft,
    borderBottomRightRadius: bottomRight ?? topLeft,
    borderBottomLeftRadius: bottomLeft ?? topRight ?? topLeft,
  };
}

function collapseToShorthand(values: {
  borderTopLeftRadius: number;
  borderTopRightRadius: number;
  borderBottomRightRadius: number;
  borderBottomLeftRadius: number;
  unit: string;
}): string {
  const {
    borderTopLeftRadius,
    borderTopRightRadius,
    borderBottomRightRadius,
    borderBottomLeftRadius,
    unit,
  } = values;

  if (
    borderTopLeftRadius === borderTopRightRadius &&
    borderTopLeftRadius === borderBottomRightRadius &&
    borderTopLeftRadius === borderBottomLeftRadius
  ) {
    return `${borderTopLeftRadius}${unit}`;
  }

  if (
    borderTopLeftRadius === borderBottomRightRadius &&
    borderTopRightRadius === borderBottomLeftRadius
  ) {
    return `${borderTopLeftRadius}${unit} ${borderTopRightRadius}${unit}`;
  }

  if (borderTopRightRadius === borderBottomLeftRadius) {
    return `${borderTopLeftRadius}${unit} ${borderTopRightRadius}${unit} ${borderBottomRightRadius}${unit}`;
  }

  return `${borderTopLeftRadius}${unit} ${borderTopRightRadius}${unit} ${borderBottomRightRadius}${unit} ${borderBottomLeftRadius}${unit}`;
}
