'use client';

import { BorderPicker } from '../components/border-picker';
import { BorderRadiusPicker } from '../components/border-radius-picker';
import { Section } from '../components/section';
import type { InspectorNodeContext } from '../node';

interface InspectorBorderProps {
  context: InspectorNodeContext;
  initialCollapsed?: boolean;
}

export function InspectorBorder({
  context,
  initialCollapsed = false,
}: InspectorBorderProps) {
  const { getStyle, setStyle, batchSetStyle } = context;

  const styleObject: Record<string, string | number | undefined> = {};
  const borderProps = [
    'borderWidth',
    'borderColor',
    'borderStyle',
    'borderTopWidth',
    'borderTopColor',
    'borderTopStyle',
    'borderRightWidth',
    'borderRightColor',
    'borderRightStyle',
    'borderBottomWidth',
    'borderBottomColor',
    'borderBottomStyle',
    'borderLeftWidth',
    'borderLeftColor',
    'borderLeftStyle',
    'borderRadius',
  ] as const;

  for (const prop of borderProps) {
    styleObject[prop] = getStyle(prop);
  }

  return (
    <Section title="Border" initialCollapsed={initialCollapsed}>
      <BorderPicker
        styleObject={styleObject}
        onChange={(propOrChanges, value) => {
          if (Array.isArray(propOrChanges)) {
            batchSetStyle(
              propOrChanges.map(([p, v]) => ({
                prop: p as (typeof borderProps)[number],
                value: v,
              })),
            );
          } else {
            setStyle(propOrChanges as (typeof borderProps)[number], value!);
          }
        }}
      />
      <BorderRadiusPicker
        value={getStyle('borderRadius') ?? 0}
        onChange={(v) => setStyle('borderRadius', v)}
      />
    </Section>
  );
}
