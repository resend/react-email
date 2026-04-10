import type { Metadata } from 'next';
import { CustomExtensions as Example } from '../_components/dynamic-examples';
import { ExamplePageShell } from '../_components/example-page-shell';

export const metadata: Metadata = {
  title: 'Custom Extensions — Editor Examples',
  description:
    'A custom Callout node created with EmailNode.create — showing how to extend the editor with email-compatible nodes.',
  alternates: { canonical: '/editor/examples/custom-extensions' },
};

export default function Page() {
  return (
    <ExamplePageShell
      slug="custom-extensions"
      title="Custom Extensions"
      docsUrl="https://react.email/docs/editor/advanced/custom-extensions"
    >
      <Example />
    </ExamplePageShell>
  );
}
