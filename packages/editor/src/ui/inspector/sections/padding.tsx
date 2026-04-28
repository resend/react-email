'use client';

import { PaddingPicker } from '../components/padding-picker';
import { Section } from '../components/section';
import type { InspectorNodeContext } from '../node';

type InspectorPaddingProps = InspectorNodeContext;

export function PaddingSection({
  getStyle,
  batchSetStyle,
}: InspectorPaddingProps) {
  const value = {
    paddingTop: Number(getStyle('paddingTop')) || 0,
    paddingRight: Number(getStyle('paddingRight')) || 0,
    paddingBottom: Number(getStyle('paddingBottom')) || 0,
    paddingLeft: Number(getStyle('paddingLeft')) || 0,
  };

  return (
    <Section title="Spacing">
      <PaddingPicker
        value={value}
        onChange={(values) => {
          const changes = Object.entries(values).map(([prop, val]) => ({
            prop: prop as
              | 'paddingTop'
              | 'paddingRight'
              | 'paddingBottom'
              | 'paddingLeft',
            value: val,
          }));
          batchSetStyle(changes);
        }}
      />
    </Section>
  );
}
