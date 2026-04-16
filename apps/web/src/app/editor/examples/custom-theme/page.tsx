import type { Metadata } from 'next';
import { ExamplePageShell } from '../example-page-shell';
import { getExampleGitHubUrl, getExampleSource } from '../get-example-source';
import { CustomThemeExample as Example } from './example';

export const metadata: Metadata = {
  title: 'Custom themes — Editor examples',
  description: 'Define custom themes with createTheme and extendTheme helpers.',
  alternates: { canonical: '/editor/examples/custom-theme' },
};

export default async function Page() {
  const sourceCode = await getExampleSource('custom-theme');

  return (
    <ExamplePageShell
      slug="custom-theme"
      heading="Custom themes"
      docsUrl="https://react.email/docs/editor/features/theming"
      sourceCode={sourceCode}
      githubUrl={getExampleGitHubUrl('custom-theme')}
    >
      <Example />
    </ExamplePageShell>
  );
}
