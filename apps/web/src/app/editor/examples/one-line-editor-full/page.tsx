import type { Metadata } from 'next';
import { ExamplePageShell } from '../example-page-shell';
import { OneLineEditorFull as Example } from './example';

export const metadata: Metadata = {
  title: 'One-Line Editor — Full Features — Editor Examples',
  description:
    'Theme switching, ref methods (export, getJSON), and callbacks — all with a single component.',
  alternates: { canonical: '/editor/examples/one-line-editor-full' },
};

export default function Page() {
  return (
    <ExamplePageShell
      slug="one-line-editor-full"
      title="One-Line Editor — Full Features"
      docsUrl="https://react.email/docs/editor/getting-started"
    >
      <Example />
    </ExamplePageShell>
  );
}
