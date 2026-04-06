'use client';

import { PropRow } from '../components/prop-row';
import { Section } from '../components/section';
import type { InspectorNodeContext } from '../node';
import { ColorInput, Label } from '../primitives';

interface InspectorBackgroundProps {
  context: InspectorNodeContext;
  initialCollapsed?: boolean;
}

export function InspectorBackground({
  context,
  initialCollapsed = false,
}: InspectorBackgroundProps) {
  const { getStyle, setStyle } = context;
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
