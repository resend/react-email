'use client';

import type { KnownCssProperties } from '../../../plugins/email-theming/types';
import { NumberInput } from '../components/number-input';
import { PropRow } from '../components/prop-row';
import { Section } from '../components/section';
import { ALIGNMENT_ITEMS, FORMAT_ITEMS } from '../config/text-config';
import type { InspectorNodeContext } from '../node';
import {
  ColorInput,
  IconButton,
  Label,
  ToggleGroup,
  Tooltip,
} from '../primitives';
import type { InspectorTextContext } from '../text';

type TypographyContext = Pick<
  InspectorNodeContext | InspectorTextContext,
  'getStyle' | 'setStyle' | 'presetColors'
> &
  Partial<
    Pick<
      InspectorTextContext,
      'marks' | 'toggleMark' | 'alignment' | 'setAlignment'
    >
  > & {
    initialCollapsed?: boolean;
  };

export function TypographySection({
  getStyle,
  setStyle,
  marks,
  toggleMark,
  alignment,
  setAlignment,
  initialCollapsed = false,
}: TypographyContext) {
  const color = String(getStyle('color') ?? '');
  const fontSize = getStyle('fontSize') ?? '';
  const lineHeight = getStyle('lineHeight') ?? '';

  return (
    <Section title="Typography" initialCollapsed={initialCollapsed}>
      <PropRow>
        <Label>Color</Label>
        <ColorInput value={color} onChange={(v) => setStyle('color', v)} />
      </PropRow>

      <PropRow>
        <Label>Size</Label>
        <NumberInput
          value={fontSize}
          onChange={(v) => setStyle('fontSize', v)}
          unit="px"
          min={1}
        />
      </PropRow>

      <PropRow>
        <Label>Line height</Label>
        <NumberInput
          value={lineHeight}
          onChange={(v) => setStyle('lineHeight' as KnownCssProperties, v)}
          unit="%"
        />
      </PropRow>

      {marks && toggleMark && (
        <PropRow>
          <Label>Format</Label>
          <div className="flex items-center gap-0.5">
            {FORMAT_ITEMS.map((item) => (
              <Tooltip.Root key={item.value}>
                <Tooltip.Trigger>
                  <IconButton
                    onClick={() => toggleMark(item.value)}
                    aria-pressed={marks[item.value] ?? false}
                    aria-label={item.label}
                  >
                    <item.icon size={16} />
                  </IconButton>
                </Tooltip.Trigger>
                <Tooltip.Content>{item.label}</Tooltip.Content>
              </Tooltip.Root>
            ))}
          </div>
        </PropRow>
      )}

      {alignment && setAlignment && (
        <PropRow>
          <Label>Align</Label>
          <ToggleGroup.Root value={alignment} onValueChange={setAlignment}>
            {ALIGNMENT_ITEMS.map((item) => (
              <Tooltip.Root key={item.value}>
                <Tooltip.Trigger>
                  <ToggleGroup.Item value={item.value}>
                    <item.icon size={16} />
                  </ToggleGroup.Item>
                </Tooltip.Trigger>
                <Tooltip.Content>
                  {item.value.charAt(0).toUpperCase() + item.value.slice(1)}
                </Tooltip.Content>
              </Tooltip.Root>
            ))}
          </ToggleGroup.Root>
        </PropRow>
      )}
    </Section>
  );
}
