'use client';

import { NumberInput } from '../components/number-input';
import { PropRow } from '../components/prop-row';
import { Section } from '../components/section';
import type { InspectorNodeContext } from '../node';
import { Label } from '../primitives';

const SIZE_AS_ATTRIBUTES = ['image'];

interface InspectorSizeProps {
  context: InspectorNodeContext;
  initialCollapsed?: boolean;
}

export function InspectorSize({
  context,
  initialCollapsed = false,
}: InspectorSizeProps) {
  const { nodeType, getStyle, setStyle, getAttr, setAttr } = context;
  const useAttrs = SIZE_AS_ATTRIBUTES.includes(nodeType);

  const width = useAttrs
    ? ((getAttr('width') as string | number) ?? '')
    : (getStyle('width') ?? '');
  const height = useAttrs
    ? ((getAttr('height') as string | number) ?? '')
    : (getStyle('height') ?? '');

  const setWidth = (v: number | '') => {
    if (useAttrs) {
      setAttr('width', v === '' ? '' : v);
    } else {
      setStyle('width', v);
    }
  };

  const setHeight = (v: number | '') => {
    if (useAttrs) {
      setAttr('height', v === '' ? '' : v);
    } else {
      setStyle('height', v);
    }
  };

  return (
    <Section title="Size" initialCollapsed={initialCollapsed}>
      <PropRow>
        <Label>Width</Label>
        <NumberInput
          value={width}
          onChange={setWidth}
          unit="px"
          placeholder="auto"
          min={0}
        />
      </PropRow>
      <PropRow>
        <Label>Height</Label>
        <NumberInput
          value={height}
          onChange={setHeight}
          unit="px"
          placeholder="auto"
          min={0}
        />
      </PropRow>
    </Section>
  );
}
