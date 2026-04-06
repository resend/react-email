'use client';

import { PropRow } from '../components/prop-row';
import { Section } from '../components/section';
import type { InspectorNodeContext } from '../node';
import { ColorInput, Label } from '../primitives';

type InspectorBackgroundProps = InspectorNodeContext & {
  initialCollapsed?: boolean;
};

export function InspectorBackground({
  getStyle,
  setStyle,
  initialCollapsed = false,
}: InspectorBackgroundProps) {
  const value = String(getStyle('backgroundColor') ?? '');

  return (
    <Section title="Background" initialCollapsed={initialCollapsed}>
      <PropRow>
        <Label>Color</Label>
        <ColorInput
          value={value}
          onChange={(v) => setStyle('backgroundColor', v)}
        />
      </PropRow>
    </Section>
  );
}
