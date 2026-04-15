import type { Metadata } from 'next';
import { ExamplePageShell } from '../example-page-shell';
import { Buttons as Example } from './example';

export const metadata: Metadata = {
  title: 'Buttons — Editor Examples',
  description: 'Click the button to edit its link via the button bubble menu.',
  alternates: { canonical: '/editor/examples/buttons' },
};

export default function Page() {
  return (
    <ExamplePageShell
      slug="buttons"
      title="Buttons"
      docsUrl="/docs/editor/features/buttons"
    >
      <Example />
    </ExamplePageShell>
  );
}
