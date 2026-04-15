import type { Metadata } from 'next';
import { ExamplePageShell } from '../example-page-shell';
import { InspectorCustom as Example } from './example';

export const metadata: Metadata = {
  title: 'Inspector — Fully Custom — Editor Examples',
  description:
    'Build the entire inspector UI from scratch using only render-props data and plain HTML.',
  alternates: { canonical: '/editor/examples/inspector-custom' },
};

export default function Page() {
  return (
    <ExamplePageShell
      slug="inspector-custom"
      title="Inspector — Fully Custom"
      docsUrl="/docs/editor/overview"
    >
      <Example />
    </ExamplePageShell>
  );
}
