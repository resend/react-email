import type { Metadata } from 'next';
import { ExamplePageShell } from '../example-page-shell';
import { getExampleGitHubUrl, getExampleSource } from '../get-example-source';
import { HtmlToTiptap as Example } from './example';

export const metadata: Metadata = {
  title: 'HTML to Tiptap — Editor examples',
  description:
    'Convert raw HTML into Tiptap JSON and load it into @react-email/editor.',
  alternates: { canonical: '/editor/html-to-tiptap' },
};

export default async function Page() {
  const sourceCode = await getExampleSource('html-to-tiptap');

  return (
    <ExamplePageShell
      slug="html-to-tiptap"
      heading="HTML to Tiptap"
      sourceCode={sourceCode}
      githubUrl={getExampleGitHubUrl('html-to-tiptap')}
    >
      <Example />
    </ExamplePageShell>
  );
}
