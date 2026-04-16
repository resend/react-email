import type { Metadata } from 'next';
import { ExamplePageShell } from '../example-page-shell';
import { getExampleGitHubUrl, getExampleSource } from '../get-example-source';
import { InspectorComposed as Example } from './example';

export const metadata: Metadata = {
  title: 'Inspector — Composed — Editor Examples',
  description:
    'Cherry-pick which sections render, control collapse state, and mix in custom sections alongside built-in ones.',
  alternates: { canonical: '/editor/examples/inspector-composed' },
};

export default async function Page() {
  const sourceCode = await getExampleSource('inspector-composed');

  return (
    <ExamplePageShell
      slug="inspector-composed"
      title="Inspector — Composed"
      docsUrl="https://react.email/docs/editor/overview"
      sourceCode={sourceCode}
      githubUrl={getExampleGitHubUrl('inspector-composed')}
    >
      <Example />
    </ExamplePageShell>
  );
}
