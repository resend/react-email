import type { Metadata } from 'next';
import { ExamplePageShell } from '../example-page-shell';
import { getExampleGitHubUrl, getExampleSource } from '../get-example-source';
import { EmailExport as Example } from './example';

export const metadata: Metadata = {
  title: 'Email export — Editor examples',
  description:
    'Edit content and export it as email-ready HTML using composeReactEmail().',
  alternates: { canonical: '/editor/email-export' },
};

export default async function Page() {
  const sourceCode = await getExampleSource('email-export');

  return (
    <ExamplePageShell
      slug="email-export"
      heading="Email export"
      docsUrl="https://react.email/docs/editor/features/email-export"
      sourceCode={sourceCode}
      githubUrl={getExampleGitHubUrl('email-export')}
    >
      <Example />
    </ExamplePageShell>
  );
}
