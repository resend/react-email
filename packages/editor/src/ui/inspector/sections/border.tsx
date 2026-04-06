'use client';

import { BorderPicker } from '../components/border-picker';
import { BorderRadiusPicker } from '../components/border-radius-picker';
import { Section } from '../components/section';
import type { InspectorNodeContext } from '../node';

type InspectorBorderProps = InspectorNodeContext & {
  initialCollapsed?: boolean;
};

const BORDER_PROPS = [
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

export function InspectorBorder({
  getStyle,
  setStyle,
  batchSetStyle,
  initialCollapsed = false,
}: InspectorBorderProps) {
  const styleObject: Record<string, string | number | undefined> = {};
  for (const prop of BORDER_PROPS) {
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
                prop: p as (typeof BORDER_PROPS)[number],
                value: v,
              })),
            );
          } else {
            setStyle(propOrChanges as (typeof BORDER_PROPS)[number], value!);
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
