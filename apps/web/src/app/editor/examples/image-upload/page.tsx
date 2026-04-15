import type { Metadata } from 'next';
import { ExamplePageShell } from '../example-page-shell';
import { ImageUpload as Example } from './example';

export const metadata: Metadata = {
  title: 'Image Upload — Editor Examples',
  description:
    'Upload images via paste, drop, or the slash command using the useEditorImage hook.',
  alternates: { canonical: '/editor/examples/image-upload' },
};

export default function Page() {
  return (
    <ExamplePageShell
      slug="image-upload"
      title="Image Upload"
      docsUrl="https://react.email/docs/editor/features/image-upload"
    >
      <Example />
    </ExamplePageShell>
  );
}
