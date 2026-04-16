import type { Metadata } from 'next';
import { ExamplePageShell } from '../example-page-shell';
import { getExampleGitHubUrl, getExampleSource } from '../get-example-source';
import { BubbleMenuExample as Example } from './example';

export const metadata: Metadata = {
  title: 'Bubble Menu — Editor Examples',
  description:
    'Select text to see the default bubble menu with formatting options.',
  alternates: { canonical: '/editor/examples/bubble-menu' },
};

export default async function Page() {
  const sourceCode = await getExampleSource('bubble-menu');

  return (
    <ExamplePageShell
      slug="bubble-menu"
      title="Bubble Menu"
      docsUrl="https://react.email/docs/editor/features/bubble-menu"
      sourceCode={sourceCode}
      githubUrl={getExampleGitHubUrl('bubble-menu')}
    >
      <Example />
    </ExamplePageShell>
  );
}
