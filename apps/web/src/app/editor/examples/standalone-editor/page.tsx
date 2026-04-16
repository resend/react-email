import type { Metadata } from 'next';
import { ExamplePageShell } from '../example-page-shell';
import { StandaloneEditor as Example } from './example';

export const metadata: Metadata = {
  title: 'Standalone Editor — Minimal — Editor Examples',
  description: 'The simplest setup — one component with everything included.',
  alternates: { canonical: '/editor/examples/standalone-editor' },
};

export default function Page() {
  return (
    <ExamplePageShell
      slug="standalone-editor"
      title="Standalone Editor — Minimal"
      docsUrl="https://react.email/docs/editor/getting-started"
    >
      <Example />
    </ExamplePageShell>
  );
}
