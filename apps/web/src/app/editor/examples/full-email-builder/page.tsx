import type { Metadata } from 'next';
import { ExamplePageShell } from '../example-page-shell';
import { getExampleGitHubUrl, getExampleSource } from '../get-example-source';
import { FullEmailBuilder as Example } from './example';

export const metadata: Metadata = {
  title: 'Full email builder — Editor examples',
  description:
    'All components combined: bubble menus, slash commands, theming, inspector sidebar, and export.',
  alternates: { canonical: '/editor/examples/full-email-builder' },
};

export default async function Page() {
  const sourceCode = await getExampleSource('full-email-builder');

  return (
    <ExamplePageShell
      slug="full-email-builder"
      title="Full email builder"
      docsUrl="https://react.email/docs/editor/features/email-export"
      sourceCode={sourceCode}
      githubUrl={getExampleGitHubUrl('full-email-builder')}
    >
      <Example />
    </ExamplePageShell>
  );
}
