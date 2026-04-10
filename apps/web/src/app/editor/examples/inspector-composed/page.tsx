import type { Metadata } from 'next';
import { InspectorComposed as Example } from './example';
import { ExamplePageShell } from '../example-page-shell';

export const metadata: Metadata = {
  title: 'Inspector — Composed — Editor Examples',
  description:
    'Cherry-pick which sections render, control collapse state, and mix in custom sections alongside built-in ones.',
  alternates: { canonical: '/editor/examples/inspector-composed' },
};

export default function Page() {
  return (
    <ExamplePageShell
      slug="inspector-composed"
      title="Inspector — Composed"
      docsUrl="https://react.email/docs/editor/overview"
    >
      <Example />
    </ExamplePageShell>
  );
}
