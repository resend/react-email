import type { Metadata } from 'next';
import { ExamplePageShell } from '../example-page-shell';
import { StandaloneEditorFull as Example } from './example';

export const metadata: Metadata = {
  title: 'Standalone Editor — Full Features — Editor Examples',
  description:
    'Theme switching, ref methods (getEmailHTML, getJSON), and callbacks — all with a single component.',
  alternates: { canonical: '/editor/examples/standalone-editor-full' },
};

export default function Page() {
  return (
    <ExamplePageShell
      slug="standalone-editor-full"
      title="Standalone Editor — Full Features"
      docsUrl="https://react.email/docs/editor/getting-started"
    >
      <Example />
    </ExamplePageShell>
  );
}
