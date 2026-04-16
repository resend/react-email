import type { Metadata } from 'next';
import { ExamplePageShell } from '../example-page-shell';
import { getExampleGitHubUrl, getExampleSource } from '../get-example-source';
import { Buttons as Example } from './example';

export const metadata: Metadata = {
  title: 'Buttons — Editor examples',
  description: 'Click the button to edit its link via the button bubble menu.',
  alternates: { canonical: '/editor/examples/buttons' },
};

export default async function Page() {
  const sourceCode = await getExampleSource('buttons');

  return (
    <ExamplePageShell
      slug="buttons"
      heading="Buttons"
      docsUrl="https://react.email/docs/editor/features/buttons"
      sourceCode={sourceCode}
      githubUrl={getExampleGitHubUrl('buttons')}
    >
      <Example />
    </ExamplePageShell>
  );
}
