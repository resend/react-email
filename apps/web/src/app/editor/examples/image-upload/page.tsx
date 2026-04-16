import type { Metadata } from 'next';
import { ExamplePageShell } from '../example-page-shell';
import { getExampleGitHubUrl, getExampleSource } from '../get-example-source';
import { ImageUpload as Example } from './example';

export const metadata: Metadata = {
  title: 'Image upload — Editor examples',
  description:
    'Upload images via paste, drop, or the slash command using the useEditorImage hook.',
  alternates: { canonical: '/editor/examples/image-upload' },
};

export default async function Page() {
  const sourceCode = await getExampleSource('image-upload');

  return (
    <ExamplePageShell
      slug="image-upload"
      heading="Image upload"
      docsUrl="https://react.email/docs/editor/features/image-upload"
      sourceCode={sourceCode}
      githubUrl={getExampleGitHubUrl('image-upload')}
    >
      <Example />
    </ExamplePageShell>
  );
}
