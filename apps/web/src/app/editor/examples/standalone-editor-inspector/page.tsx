import type { Metadata } from 'next';
import { ExamplePageShell } from '../example-page-shell';
import { getExampleGitHubUrl, getExampleSource } from '../get-example-source';
import { StandaloneEditorInspector as Example } from './example';

export const metadata: Metadata = {
  title: 'Standalone editor — inspector — Editor examples',
  description: 'Add an inspector sidebar alongside the standalone EmailEditor.',
  alternates: { canonical: '/editor/examples/standalone-editor-inspector' },
};

export default async function Page() {
  const sourceCode = await getExampleSource('standalone-editor-inspector');

  return (
    <ExamplePageShell
      slug="standalone-editor-inspector"
      title="Standalone editor — inspector"
      docsUrl="https://react.email/docs/editor/features/inspector"
      sourceCode={sourceCode}
      githubUrl={getExampleGitHubUrl('standalone-editor-inspector')}
    >
      <Example />
    </ExamplePageShell>
  );
}
