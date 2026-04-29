'use client';

import { NumberInput } from '../components/number-input';
import { PropRow } from '../components/prop-row';
import { Section } from '../components/section';
import type { InspectorNodeContext } from '../node';
import { Label } from '../primitives';

const COLUMN_PARENT_TYPES = new Set([
  'twoColumns',
  'threeColumns',
  'fourColumns',
]);

type InspectorColumnSpacingProps = InspectorNodeContext;

export function ColumnSpacingSection({
  nodeType,
  getAttr,
  setAttr,
}: InspectorColumnSpacingProps) {
  if (!COLUMN_PARENT_TYPES.has(nodeType)) {
    return null;
  }

  const rawCellspacing = getAttr('cellspacing');
  const cellspacing =
    rawCellspacing === undefined ||
    rawCellspacing === null ||
    rawCellspacing === ''
      ? 0
      : (rawCellspacing as string | number);

  return (
    <Section title="Column spacing">
      <PropRow>
        <Label>Cell spacing</Label>
        <NumberInput
          value={cellspacing}
          onChange={(value) => setAttr('cellspacing', value === '' ? 0 : value)}
          unit="px"
          placeholder="0"
          min={0}
        />
      </PropRow>
    </Section>
  );
}
