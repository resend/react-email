'use client';

import { PropRow } from '../components/prop-row';
import { Section } from '../components/section';
import { ColorInput, Label, TextField } from '../primitives';
import type { InspectorTextContext } from '../text';

interface InspectorLinkProps {
  context: Pick<
    InspectorTextContext,
    'linkHref' | 'linkColor' | 'setLinkColor' | 'isLinkActive' | 'presetColors'
  >;
  initialCollapsed?: boolean;
}

export function InspectorLink({
  context,
  initialCollapsed = false,
}: InspectorLinkProps) {
  const { linkHref, linkColor, setLinkColor, isLinkActive } = context;

  if (!isLinkActive) {
    return null;
  }

  return (
    <Section title="Link" initialCollapsed={initialCollapsed}>
      <PropRow>
        <Label>URL</Label>
        <TextField type="text" value={linkHref} readOnly />
      </PropRow>
      <PropRow>
        <Label>Color</Label>
        <ColorInput value={linkColor} onChange={setLinkColor} />
      </PropRow>
    </Section>
  );
}
