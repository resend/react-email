import type { Metadata } from 'next';
import { InspectorCustom as Example } from './example';
import { ExamplePageShell } from '../example-page-shell';

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
      docsUrl="https://react.email/docs/editor/overview"
    >
      <Example />
    </ExamplePageShell>
  );
}
