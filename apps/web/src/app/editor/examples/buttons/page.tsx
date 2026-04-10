import type { Metadata } from 'next';
import { Buttons as Example } from '../_components/dynamic-examples';
import { ExamplePageShell } from '../_components/example-page-shell';

export const metadata: Metadata = {
  title: 'Buttons — Editor Examples',
  description:
    'Click the button to edit its link via the button bubble menu.',
  alternates: { canonical: '/editor/examples/buttons' },
};

export default function Page() {
  return (
    <ExamplePageShell
      slug="buttons"
      title="Buttons"
      docsUrl="https://react.email/docs/editor/features/buttons"
    >
      <Example />
    </ExamplePageShell>
  );
}
