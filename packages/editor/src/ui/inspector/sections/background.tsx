'use client';

import { PropRow } from '../components/prop-row';
import { Section } from '../components/section';
import type { InspectorNodeContext } from '../node';
import { ColorInput, Label } from '../primitives';

type InspectorBackgroundProps = InspectorNodeContext;

export function BackgroundSection({
  getStyle,
  setStyle,
}: InspectorBackgroundProps) {
  const value = String(getStyle('backgroundColor') ?? '');

  return (
    <Section title="Background">
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
