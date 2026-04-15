import type { Metadata } from 'next';
import { ExamplePageShell } from '../example-page-shell';
import { StandaloneEditorInspector as Example } from './example';

export const metadata: Metadata = {
  title: 'Standalone Editor — Inspector — Editor Examples',
  description: 'Add an inspector sidebar alongside the standalone EmailEditor.',
  alternates: { canonical: '/editor/examples/standalone-editor-inspector' },
};

export default function Page() {
  return (
    <ExamplePageShell
      slug="standalone-editor-inspector"
      title="Standalone Editor — Inspector"
      docsUrl="/docs/editor/features/inspector"
    >
      <Example />
    </ExamplePageShell>
  );
}
