'use client';

import {
  CornerBottomLeftIcon,
  CornerBottomRightIcon,
  CornerTopLeftIcon,
  CornerTopRightIcon,
} from '@radix-ui/react-icons';
import { SquareDashedIcon, SquareIcon } from 'lucide-react';
import * as React from 'react';
import { Label } from '@/ui/label';
import { Text } from '@/ui/text';
import { TextField } from '@/ui/text-field';
import { ToggleGroup } from '@/ui/toggle-group';
import * as Tooltip from '@/ui/tooltip';
import { PropRow } from './prop-row';
import { useDragToChange } from './use-drag-to-change';
import { useNumericInput } from './use-numeric-input';

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

  const handleModeChange = (mode: string | string[]) => {
    const m = Array.isArray(mode) ? mode[0] : mode;
    if (m === 'uniform' && expanded) {
      const uniform =
        expandedValues.borderTopLeftRadius ??
        expandedValues.borderTopRightRadius ??
        expandedValues.borderBottomRightRadius ??
        expandedValues.borderBottomLeftRadius ??
        0;
      onChange(`${uniform}${unit}`);
      setExpanded(false);
    } else if (m === 'individual' && !expanded) {
      setExpanded(true);
    }
  };

  if (expanded) {
    return (
      <div className="flex flex-col gap-2">
        <PropRow>
          <Label>Rounded</Label>
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
          <div className="flex items-center gap-1.5">
            <BorderRadiusInput
              icon={<CornerTopLeftIcon className="size-3.5" />}
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
            <BorderRadiusInput
              icon={<CornerTopRightIcon className="size-3.5" />}
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
            <BorderRadiusInput
              icon={<CornerBottomLeftIcon className="size-3.5" />}
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
            <BorderRadiusInput
              icon={<CornerBottomRightIcon className="size-3.5" />}
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

  const handleUniformChange = (newValue: number) => {
    onChange(`${newValue}${unit}`);
  };

  return (
    <PropRow>
      <Label>Rounded</Label>

      <div className="flex items-center gap-1">
        <BorderRadiusInput
          value={expandedValues.borderTopLeftRadius}
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

interface BorderRadiusInputProps {
  icon?: React.ReactNode;
  value: number | undefined;
  onChange: (value: number) => void;
  unit: string;
}

function BorderRadiusInput({
  icon,
  value,
  onChange,
  unit,
}: BorderRadiusInputProps) {
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
          <span className="pointer-events-none pl-1 text-gray-8">{icon}</span>
        </TextField.Slot>
      )}
      <TextField.Input
        type="text"
        inputMode="numeric"
        value={displayValue}
        className="h-7 font-mono"
        style={
          { '--text-field-right-slot-width': '16px' } as React.CSSProperties
        }
        {...handlers}
      />
      <TextField.Slot>
        <Text size="1" color="gray" className="pr-1 font-mono" {...dragProps}>
          {unit}
        </Text>
      </TextField.Slot>
    </TextField.Root>
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
