import type { Metadata } from 'next';
import { ExamplePageShell } from '../example-page-shell';
import { CustomBubbleMenu as Example } from './example';

export const metadata: Metadata = {
  title: 'Custom Bubble Menu — Editor Examples',
  description: 'Building bubble menus from primitives.',
  alternates: { canonical: '/editor/examples/custom-bubble-menu' },
};

export default function Page() {
  return (
    <ExamplePageShell
      slug="custom-bubble-menu"
      title="Custom Bubble Menu"
      docsUrl="/docs/editor/features/bubble-menu"
    >
      <Example />
    </ExamplePageShell>
  );
}
