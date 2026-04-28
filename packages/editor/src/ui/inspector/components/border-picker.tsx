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
  { side: 'Top', icon: <PanelTopIcon size={14} /> },
  { side: 'Right', icon: <PanelRightIcon size={14} /> },
  { side: 'Bottom', icon: <PanelBottomIcon size={14} /> },
  { side: 'Left', icon: <PanelLeftIcon size={14} /> },
];

interface BorderPickerProps {
  styleObject: Record<string, string | number | undefined>;
  onChange: BatchableChangeFn;
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

const BORDER_STYLE_OPTIONS = SUPPORTED_CSS_PROPERTIES.borderStyle
  .options as Record<string, string>;

export function BorderPicker({ styleObject, onChange }: BorderPickerProps) {
  const [expanded, setExpanded] = React.useState(
    () => !allSidesEqual(styleObject),
  );

  const handleModeChange = (mode: string) => {
    if (mode === 'uniform' && expanded) {
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
    } else if (mode === 'individual' && !expanded) {
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
          <Label>Border</Label>
          {modeToggle}
        </PropRow>

        <div className="flex flex-col gap-1.5">
          {SIDES.map(({ side, icon }) => (
            <div key={side} className="flex flex-col items-center gap-1">
              <div className="flex gap-1 w-full">
                <BorderWidthInput
                  icon={icon}
                  value={getSideValue(styleObject, side, 'Width')}
                  onChange={(v) => onChange(`border${side}Width`, v)}
                  className="w-full"
                />

                <ColorInput
                  value={String(
                    getSideValue(styleObject, side, 'Color') ??
                      SUPPORTED_CSS_PROPERTIES.borderColor.defaultValue,
                  )}
                  onChange={(v) => onChange(`border${side}Color`, v)}
                  className="w-full"
                />
              </div>

              <div className="flex gap-1 w-full">
                <Select.Root
                  className="w-full"
                  value={String(
                    getSideValue(styleObject, side, 'Style') ??
                      SUPPORTED_CSS_PROPERTIES.borderStyle.defaultValue,
                  )}
                  onChange={(e) =>
                    onChange(`border${side}Style`, e.target.value)
                  }
                >
                  {Object.entries(BORDER_STYLE_OPTIONS).map(([val, label]) => (
                    <Select.Item key={val} value={val}>
                      {label}
                    </Select.Item>
                  ))}
                </Select.Root>

                <IconButton
                  onClick={() => {
                    onChange([
                      [`border${side}Width`, ''],
                      [`border${side}Style`, ''],
                      [`border${side}Color`, ''],
                    ]);
                  }}
                  aria-label={`Clear ${side.toLowerCase()} border`}
                >
                  <XIcon size={14} />
                </IconButton>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const uniformColor = String(
    styleObject.borderColor ??
      SUPPORTED_CSS_PROPERTIES.borderColor.defaultValue,
  );

  return (
    <div className="flex flex-col gap-3 w-full">
      <PropRow>
        <Label>Border</Label>
        <div className="flex items-center gap-1">
          <BorderWidthInput
            value={styleObject.borderWidth ?? ''}
            onChange={(v) => onChange('borderWidth', v)}
          />
          {modeToggle}
        </div>
      </PropRow>

      <PropRow>
        <Label>Border color</Label>
        <ColorInput
          value={uniformColor}
          onChange={(v) => onChange('borderColor', v)}
        />
      </PropRow>
    </div>
  );
}

function BorderWidthInput({
  icon,
  value,
  onChange,
  className,
}: {
  icon?: React.ReactNode;
  value: string | number | undefined;
  onChange: (value: number | '') => void;
  className?: string;
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
    <span data-re-inspector-number="" className={className}>
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
        placeholder={String(SUPPORTED_CSS_PROPERTIES.borderWidth.defaultValue)}
        {...handlers}
      />
      <span data-re-inspector-unit="" {...dragProps}>
        px
      </span>
    </span>
  );
}
