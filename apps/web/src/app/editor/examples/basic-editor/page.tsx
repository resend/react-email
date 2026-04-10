import type { Metadata } from 'next';
import { BasicEditor as Example } from '../dynamic-imports';
import { ExamplePageShell } from '../example-page-shell';

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
      docsUrl="https://react.email/docs/editor/getting-started"
    >
      <Example />
    </ExamplePageShell>
  );
}
