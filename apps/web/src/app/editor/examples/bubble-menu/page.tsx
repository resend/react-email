import type { Metadata } from 'next';
import { BubbleMenuExample as Example } from '../_components/dynamic-examples';
import { ExamplePageShell } from '../_components/example-page-shell';

export const metadata: Metadata = {
  title: 'Bubble Menu — Editor Examples',
  description:
    'Select text to see the default bubble menu with formatting options.',
  alternates: { canonical: '/editor/examples/bubble-menu' },
};

export default function Page() {
  return (
    <ExamplePageShell
      slug="bubble-menu"
      title="Bubble Menu"
      docsUrl="https://react.email/docs/editor/features/bubble-menu"
    >
      <Example />
    </ExamplePageShell>
  );
}
