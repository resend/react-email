import type { Metadata } from 'next';
import { LinkEditing as Example } from '../dynamic-imports';
import { ExamplePageShell } from '../example-page-shell';

export const metadata: Metadata = {
  title: 'Link Editing — Editor Examples',
  description:
    'Click a link to see the link bubble menu. Select text and press Cmd+K to add links.',
  alternates: { canonical: '/editor/examples/link-editing' },
};

export default function Page() {
  return (
    <ExamplePageShell
      slug="link-editing"
      title="Link Editing"
      docsUrl="https://react.email/docs/editor/features/link-editing"
    >
      <Example />
    </ExamplePageShell>
  );
}
