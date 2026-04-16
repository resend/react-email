import type { Metadata } from 'next';
import { ExamplePageShell } from '../example-page-shell';
import { getExampleGitHubUrl, getExampleSource } from '../get-example-source';
import { StandaloneEditor as Example } from './example';

export const metadata: Metadata = {
  title: 'Standalone Editor — Minimal — Editor Examples',
  description: 'The simplest setup — one component with everything included.',
  alternates: { canonical: '/editor/examples/standalone-editor' },
};

export default async function Page() {
  const sourceCode = await getExampleSource('standalone-editor');

  return (
    <ExamplePageShell
      slug="standalone-editor"
      title="Standalone Editor — Minimal"
      docsUrl="https://react.email/docs/editor/getting-started"
      sourceCode={sourceCode}
      githubUrl={getExampleGitHubUrl('standalone-editor')}
    >
      <Example />
    </ExamplePageShell>
  );
}
