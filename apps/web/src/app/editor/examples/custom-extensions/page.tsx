import type { Metadata } from 'next';
import { ExamplePageShell } from '../example-page-shell';
import { getExampleGitHubUrl, getExampleSource } from '../get-example-source';
import { CustomExtensions as Example } from './example';

export const metadata: Metadata = {
  title: 'Custom Extensions — Editor Examples',
  description:
    'A custom Callout node created with EmailNode.create — showing how to extend the editor with email-compatible nodes.',
  alternates: { canonical: '/editor/examples/custom-extensions' },
};

export default async function Page() {
  const sourceCode = await getExampleSource('custom-extensions');

  return (
    <ExamplePageShell
      slug="custom-extensions"
      title="Custom Extensions"
      docsUrl="https://react.email/docs/editor/advanced/custom-extensions"
      sourceCode={sourceCode}
      githubUrl={getExampleGitHubUrl('custom-extensions')}
    >
      <Example />
    </ExamplePageShell>
  );
}
