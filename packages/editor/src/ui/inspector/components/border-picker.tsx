'use client';

import * as React from 'react';
import { SUPPORTED_CSS_PROPERTIES } from '../../../plugins/email-theming/themes';
import {
  PanelBottomIcon,
  PanelLeftIcon,
  PanelRightIcon,
  PanelTopIcon,
  SquareDashedIcon,
  SquareIcon,
  XIcon,
} from '../../icons';
import { useDragToChange } from '../hooks/use-drag-to-change';
import { useNumericInput } from '../hooks/use-numeric-input';
import {
  ColorInput,
  IconButton,
  Label,
  Select,
  Text,
  TextField,
  ToggleGroup,
  Tooltip,
} from '../primitives';
import { PropRow } from './prop-row';

export type BatchableChangeFn = (
  propOrChanges: string | [string, string | number][],
  value?: string | number,
) => void;

type Side = 'Top' | 'Right' | 'Bottom' | 'Left';

const SIDES: { side: Side; icon: React.ReactNode }[] = [
  { side: 'Top', icon: <PanelTopIcon className="size-3.5" /> },
  { side: 'Right', icon: <PanelRightIcon className="size-3.5" /> },
  { side: 'Bottom', icon: <PanelBottomIcon className="size-3.5" /> },
  { side: 'Left', icon: <PanelLeftIcon className="size-3.5" /> },
];

interface BorderPickerProps {
  styleObject: Record<string, string | number | undefined>;
  onChange: BatchableChangeFn;
  presetColors?: string[];
}

function getSideValue(
  styleObject: Record<string, string | number | undefined>,
  side: Side,
  prop: 'Width' | 'Color' | 'Style',
): string | number | undefined {
  const sideKey = `border${side}${prop}`;
  const shorthandKey = `border${prop}`;
  return styleObject[sideKey] ?? styleObject[shorthandKey];
}

function allSidesEqual(
  styleObject: Record<string, string | number | undefined>,
): boolean {
  const topWidth = getSideValue(styleObject, 'Top', 'Width');
  const topColor = getSideValue(styleObject, 'Top', 'Color');
  const topStyle = getSideValue(styleObject, 'Top', 'Style');

  return SIDES.every(({ side }) => {
    return (
      getSideValue(styleObject, side, 'Width') === topWidth &&
      getSideValue(styleObject, side, 'Color') === topColor &&
      getSideValue(styleObject, side, 'Style') === topStyle
    );
  });
}

export function BorderPicker({
  styleObject,
  onChange,
  presetColors,
}: BorderPickerProps) {
  const [expanded, setExpanded] = React.useState(
    () => !allSidesEqual(styleObject),
  );

  const handleModeChange = (mode: string | string[]) => {
    const m = Array.isArray(mode) ? mode[0] : mode;
    if (m === 'uniform' && expanded) {
      const width =
        getSideValue(styleObject, 'Top', 'Width') ??
        String(SUPPORTED_CSS_PROPERTIES.borderWidth.defaultValue);
      const color =
        getSideValue(styleObject, 'Top', 'Color') ??
        String(SUPPORTED_CSS_PROPERTIES.borderColor.defaultValue);
      const style =
        getSideValue(styleObject, 'Top', 'Style') ??
        String(SUPPORTED_CSS_PROPERTIES.borderStyle.defaultValue);

      const changes: [string, string | number][] = [
        ['borderWidth', width],
        ['borderColor', color],
        ['borderStyle', style],
      ];
      for (const { side } of SIDES) {
        changes.push(
          [`border${side}Width`, ''],
          [`border${side}Color`, ''],
          [`border${side}Style`, ''],
        );
      }

      onChange(changes);
      setExpanded(false);
    } else if (m === 'individual' && !expanded) {
      const width =
        styleObject.borderWidth ??
        String(SUPPORTED_CSS_PROPERTIES.borderWidth.defaultValue);
      const color =
        styleObject.borderColor ??
        String(SUPPORTED_CSS_PROPERTIES.borderColor.defaultValue);
      const style =
        styleObject.borderStyle ??
        String(SUPPORTED_CSS_PROPERTIES.borderStyle.defaultValue);

      const changes: [string, string | number][] = [];
      for (const { side } of SIDES) {
        changes.push(
          [`border${side}Width`, styleObject[`border${side}Width`] ?? width],
          [`border${side}Color`, styleObject[`border${side}Color`] ?? color],
          [`border${side}Style`, styleObject[`border${side}Style`] ?? style],
        );
      }
      changes.push(
        ['borderWidth', ''],
        ['borderColor', ''],
        ['borderStyle', ''],
      );

      onChange(changes);
      setExpanded(true);
    }
  };

  const uniformColor = String(
    styleObject.borderColor ??
      SUPPORTED_CSS_PROPERTIES.borderColor.defaultValue,
  );

  if (expanded) {
    return (
      <div className="flex flex-col gap-2">
        <PropRow>
          <Label>Border</Label>
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

        <div className="flex flex-col gap-1.5">
          {SIDES.map(({ side, icon }) => (
            <div key={side} className="flex items-center gap-1">
              <div className="w-20">
                <BorderWidthInput
                  icon={icon}
                  value={getSideValue(styleObject, side, 'Width')}
                  onChange={(v) => {
                    onChange(`border${side}Width`, v);
                  }}
                />
              </div>

              <div>
                <Select.Root
                  value={String(
                    getSideValue(styleObject, side, 'Style') ??
                      SUPPORTED_CSS_PROPERTIES.borderStyle.defaultValue,
                  )}
                  onValueChange={(v) => onChange(`border${side}Style`, v)}
                >
                  <Select.Trigger>
                    <Select.Value />
                  </Select.Trigger>
                  <Select.Content align="end">
                    {Object.entries(BORDER_STYLE_OPTIONS).map(
                      ([val, label]) => (
                        <Select.Item key={val} value={val}>
                          {label}
                        </Select.Item>
                      ),
                    )}
                  </Select.Content>
                </Select.Root>
              </div>

              <div className="min-w-0 flex-1">
                <ColorInput
                  defaultValue={String(
                    getSideValue(styleObject, side, 'Color') ??
                      SUPPORTED_CSS_PROPERTIES.borderColor.defaultValue,
                  )}
                  onChange={(v) => onChange(`border${side}Color`, v)}
                  onClear={() => onChange(`border${side}Color`, '')}
                  presetColors={presetColors}
                />
              </div>

              <IconButton
                size="1"
                onClick={() => {
                  onChange([
                    [`border${side}Width`, ''],
                    [`border${side}Style`, ''],
                    [`border${side}Color`, ''],
                  ]);
                }}
              >
                <XIcon className="size-3.5!" />
              </IconButton>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const uniformWidth = styleObject.borderWidth ?? '';

  return (
    <div className="flex flex-col gap-3">
      <PropRow>
        <Label>Border</Label>
        <div className="flex items-center gap-1">
          <UniformBorderWidthInput
            value={uniformWidth}
            onChange={(v) => onChange('borderWidth', v)}
          />
          <ToggleGroup.Root
            value="uniform"
            onValueChange={handleModeChange}
            className="w-[72px]"
          >
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
        </div>
      </PropRow>

      <PropRow>
        <Label />
        <div className="min-w-0 flex-1">
          <ColorInput
            defaultValue={uniformColor}
            onChange={(v) => onChange('borderColor', v)}
            onClear={() => onChange('borderColor', '')}
            presetColors={presetColors}
          />
        </div>
      </PropRow>
    </div>
  );
}

interface BorderWidthInputProps {
  icon?: React.ReactNode;
  value: string | number | undefined;
  onChange: (value: number | '') => void;
}

function BorderWidthInput({ icon, value, onChange }: BorderWidthInputProps) {
  const { displayValue, ...handlers } = useNumericInput({
    value,
    onCommit: onChange,
    allowEmpty: true,
    min: 0,
  });

  const { dragProps } = useDragToChange({
    value,
    onCommit: onChange,
    min: 0,
  });

  return (
    <TextField.Root className="min-w-0 flex-1">
      {icon && (
        <TextField.Slot>
          <span className="pointer-events-none text-gray-8">{icon}</span>
        </TextField.Slot>
      )}
      <TextField.Input
        type="text"
        inputMode="numeric"
        value={displayValue}
        placeholder={String(SUPPORTED_CSS_PROPERTIES.borderWidth.defaultValue)}
        className="h-7 font-mono"
        {...handlers}
      />
      <TextField.Slot>
        <Text size="1" color="gray" className="pr-1 font-mono" {...dragProps}>
          px
        </Text>
      </TextField.Slot>
    </TextField.Root>
  );
}

const BORDER_STYLE_OPTIONS = SUPPORTED_CSS_PROPERTIES.borderStyle
  .options as Record<string, string>;

function UniformBorderWidthInput({
  value,
  onChange,
}: {
  value: string | number | undefined;
  onChange: (value: number | '') => void;
}) {
  const { displayValue, ...handlers } = useNumericInput({
    value,
    onCommit: onChange,
    allowEmpty: true,
    min: 0,
  });

  const { dragProps } = useDragToChange({
    value,
    onCommit: onChange,
    min: 0,
  });

  return (
    <TextField.Root className="min-w-0 flex-1">
      <TextField.Input
        type="text"
        inputMode="numeric"
        value={displayValue}
        placeholder={String(SUPPORTED_CSS_PROPERTIES.borderWidth.defaultValue)}
        className="h-7 font-mono"
        style={
          { '--text-field-right-slot-width': '16px' } as React.CSSProperties
        }
        {...handlers}
      />
      <TextField.Slot>
        <Text size="1" color="gray" className="w-4 font-mono" {...dragProps}>
          px
        </Text>
      </TextField.Slot>
    </TextField.Root>
  );
}
