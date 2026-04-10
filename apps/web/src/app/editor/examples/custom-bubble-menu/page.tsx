import type { Metadata } from 'next';
import { CustomBubbleMenu as Example } from '../_components/dynamic-examples';
import { ExamplePageShell } from '../_components/example-page-shell';

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
      docsUrl="https://react.email/docs/editor/features/bubble-menu"
    >
      <Example />
    </ExamplePageShell>
  );
}
