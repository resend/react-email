'use client';

import { PropRow } from '../components/prop-row';
import { Section } from '../components/section';
import { ColorInput, Label, TextField } from '../primitives';
import type { InspectorTextContext } from '../text';

type InspectorLinkProps = Pick<
  InspectorTextContext,
  'linkHref' | 'linkColor' | 'setLinkColor' | 'isLinkActive' | 'presetColors'
>;

export function LinkSection({
  linkHref,
  linkColor,
  setLinkColor,
  isLinkActive,
}: InspectorLinkProps) {
  if (!isLinkActive) {
    return null;
  }

  return (
    <Section title="Link">
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
