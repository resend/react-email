import type { Metadata } from 'next';
import { ExamplePageShell } from '../example-page-shell';
import { getExampleGitHubUrl, getExampleSource } from '../get-example-source';
import { InspectorCustom as Example } from './example';

export const metadata: Metadata = {
  title: 'Inspector — Fully Custom — Editor Examples',
  description:
    'Build the entire inspector UI from scratch using only render-props data and plain HTML.',
  alternates: { canonical: '/editor/examples/inspector-custom' },
};

export default async function Page() {
  const sourceCode = await getExampleSource('inspector-custom');

  return (
    <ExamplePageShell
      slug="inspector-custom"
      title="Inspector — Fully Custom"
      docsUrl="https://react.email/docs/editor/overview"
      sourceCode={sourceCode}
      githubUrl={getExampleGitHubUrl('inspector-custom')}
    >
      <Example />
    </ExamplePageShell>
  );
}
