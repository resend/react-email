import type { Metadata } from 'next';
import { ExamplePageShell } from '../example-page-shell';
import { getExampleGitHubUrl, getExampleSource } from '../get-example-source';
import { InspectorDefaults as Example } from './example';

export const metadata: Metadata = {
  title: 'Inspector — defaults — Editor examples',
  description:
    'Zero-config inspector sidebar. All three inspectors render sensible defaults when no children are passed.',
  alternates: { canonical: '/editor/inspector-defaults' },
};

export default async function Page() {
  const sourceCode = await getExampleSource('inspector-defaults');

  return (
    <ExamplePageShell
      slug="inspector-defaults"
      heading="Inspector"
      subtitle="Defaults"
      docsUrl="https://react.email/docs/editor/overview"
      sourceCode={sourceCode}
      githubUrl={getExampleGitHubUrl('inspector-defaults')}
    >
      <Example />
    </ExamplePageShell>
  );
}
