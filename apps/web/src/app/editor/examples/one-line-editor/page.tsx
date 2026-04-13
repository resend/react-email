import type { Metadata } from 'next';
import { ExamplePageShell } from '../example-page-shell';
import { OneLineEditor as Example } from './example';

export const metadata: Metadata = {
  title: 'One-Line Editor — Minimal — Editor Examples',
  description: 'The simplest setup — one component with everything included.',
  alternates: { canonical: '/editor/examples/one-line-editor' },
};

export default function Page() {
  return (
    <ExamplePageShell
      slug="one-line-editor"
      title="One-Line Editor — Minimal"
      docsUrl="https://react.email/docs/editor/getting-started"
    >
      <Example />
    </ExamplePageShell>
  );
}
