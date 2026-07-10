import type { Metadata } from 'next';
import { ExamplePageShell } from '../example-page-shell';
import { getExampleGitHubUrl, getExampleSource } from '../get-example-source';
import { BasicEditor as Example } from './example';

export const metadata: Metadata = {
  title: 'Basic editor — Editor examples',
  description: 'Minimal setup with StarterKit and no UI overlays.',
  alternates: { canonical: '/editor/basic-editor' },
};

export default async function Page() {
  const sourceCode = await getExampleSource('basic-editor');

  return (
    <ExamplePageShell
      slug="basic-editor"
      heading="Basic editor"
      docsUrl="https://react.email/docs/editor/getting-started"
      sourceCode={sourceCode}
      githubUrl={getExampleGitHubUrl('basic-editor')}
    >
      <Example />
    </ExamplePageShell>
  );
}
