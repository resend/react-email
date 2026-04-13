import type { Metadata } from 'next';
import { ExamplePageShell } from '../example-page-shell';
import { OneLineEditorInspector as Example } from './example';

export const metadata: Metadata = {
  title: 'One-Line Editor — Inspector — Editor Examples',
  description:
    'Add an inspector sidebar alongside the one-line EmailEditor.',
  alternates: { canonical: '/editor/examples/one-line-editor-inspector' },
};

export default function Page() {
  return (
    <ExamplePageShell
      slug="one-line-editor-inspector"
      title="One-Line Editor — Inspector"
      docsUrl="https://react.email/docs/editor/features/inspector"
    >
      <Example />
    </ExamplePageShell>
  );
}
