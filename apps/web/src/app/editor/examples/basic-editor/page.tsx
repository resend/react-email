import type { Metadata } from 'next';
import { ExamplePageShell } from '../example-page-shell';
import { BasicEditor as Example } from './example';

export const metadata: Metadata = {
  title: 'Basic Editor — Editor Examples',
  description: 'Minimal setup with StarterKit and no UI overlays.',
  alternates: { canonical: '/editor/examples/basic-editor' },
};

export default function Page() {
  return (
    <ExamplePageShell
      slug="basic-editor"
      title="Basic Editor"
      docsUrl="/docs/editor/getting-started"
    >
      <Example />
    </ExamplePageShell>
  );
}
