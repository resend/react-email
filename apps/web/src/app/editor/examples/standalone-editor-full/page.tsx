import type { Metadata } from 'next';
import { ExamplePageShell } from '../example-page-shell';
import { getExampleGitHubUrl, getExampleSource } from '../get-example-source';
import { StandaloneEditorFull as Example } from './example';

export const metadata: Metadata = {
  title: 'Standalone editor — full features — Editor examples',
  description:
    'Theme switching, ref methods (getEmailHTML, getJSON), and callbacks — all with a single component.',
  alternates: { canonical: '/editor/examples/standalone-editor-full' },
};

export default async function Page() {
  const sourceCode = await getExampleSource('standalone-editor-full');

  return (
    <ExamplePageShell
      slug="standalone-editor-full"
      heading="Standalone editor"
      subtitle="Full features"
      docsUrl="https://react.email/docs/editor/getting-started"
      sourceCode={sourceCode}
      githubUrl={getExampleGitHubUrl('standalone-editor-full')}
    >
      <Example />
    </ExamplePageShell>
  );
}
