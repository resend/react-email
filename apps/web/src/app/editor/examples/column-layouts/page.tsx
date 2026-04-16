import type { Metadata } from 'next';
import { ExamplePageShell } from '../example-page-shell';
import { getExampleGitHubUrl, getExampleSource } from '../get-example-source';
import { ColumnLayouts as Example } from './example';

export const metadata: Metadata = {
  title: 'Column Layouts — Editor Examples',
  description: 'Insert multi-column layouts using the toolbar buttons.',
  alternates: { canonical: '/editor/examples/column-layouts' },
};

export default async function Page() {
  const sourceCode = await getExampleSource('column-layouts');

  return (
    <ExamplePageShell
      slug="column-layouts"
      title="Column Layouts"
      docsUrl="https://react.email/docs/editor/features/column-layouts"
      sourceCode={sourceCode}
      githubUrl={getExampleGitHubUrl('column-layouts')}
    >
      <Example />
    </ExamplePageShell>
  );
}
