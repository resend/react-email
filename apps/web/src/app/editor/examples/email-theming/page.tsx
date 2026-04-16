import type { Metadata } from 'next';
import { ExamplePageShell } from '../example-page-shell';
import { getExampleGitHubUrl, getExampleSource } from '../get-example-source';
import { EmailThemingExample as Example } from './example';

export const metadata: Metadata = {
  title: 'Email theming — Editor examples',
  description:
    'Switch between Basic and Minimal themes to see how email styles change.',
  alternates: { canonical: '/editor/examples/email-theming' },
};

export default async function Page() {
  const sourceCode = await getExampleSource('email-theming');

  return (
    <ExamplePageShell
      slug="email-theming"
      heading="Email theming"
      docsUrl="https://react.email/docs/editor/features/theming"
      sourceCode={sourceCode}
      githubUrl={getExampleGitHubUrl('email-theming')}
    >
      <Example />
    </ExamplePageShell>
  );
}
