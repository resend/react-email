import type { Metadata } from 'next';
import { ExamplePageShell } from '../example-page-shell';
import { getExampleGitHubUrl, getExampleSource } from '../get-example-source';
import { CustomBubbleMenu as Example } from './example';

export const metadata: Metadata = {
  title: 'Custom Bubble Menu — Editor Examples',
  description: 'Building bubble menus from primitives.',
  alternates: { canonical: '/editor/examples/custom-bubble-menu' },
};

export default async function Page() {
  const sourceCode = await getExampleSource('custom-bubble-menu');

  return (
    <ExamplePageShell
      slug="custom-bubble-menu"
      title="Custom Bubble Menu"
      docsUrl="https://react.email/docs/editor/features/bubble-menu"
      sourceCode={sourceCode}
      githubUrl={getExampleGitHubUrl('custom-bubble-menu')}
    >
      <Example />
    </ExamplePageShell>
  );
}
