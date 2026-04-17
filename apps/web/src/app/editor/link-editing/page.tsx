import type { Metadata } from 'next';
import { ExamplePageShell } from '../example-page-shell';
import { getExampleGitHubUrl, getExampleSource } from '../get-example-source';
import { LinkEditing as Example } from './example';

export const metadata: Metadata = {
  title: 'Link editing — Editor examples',
  description:
    'Click a link to see the link bubble menu. Select text and press Cmd+K to add links.',
  alternates: { canonical: '/editor/link-editing' },
};

export default async function Page() {
  const sourceCode = await getExampleSource('link-editing');

  return (
    <ExamplePageShell
      slug="link-editing"
      heading="Link editing"
      docsUrl="https://react.email/docs/editor/features/link-editing"
      sourceCode={sourceCode}
      githubUrl={getExampleGitHubUrl('link-editing')}
    >
      <Example />
    </ExamplePageShell>
  );
}
