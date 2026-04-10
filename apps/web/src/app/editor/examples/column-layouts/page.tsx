import type { Metadata } from 'next';
import { ColumnLayouts as Example } from '../dynamic-imports';
import { ExamplePageShell } from '../example-page-shell';

export const metadata: Metadata = {
  title: 'Column Layouts — Editor Examples',
  description: 'Insert multi-column layouts using the toolbar buttons.',
  alternates: { canonical: '/editor/examples/column-layouts' },
};

export default function Page() {
  return (
    <ExamplePageShell
      slug="column-layouts"
      title="Column Layouts"
      docsUrl="https://react.email/docs/editor/features/column-layouts"
    >
      <Example />
    </ExamplePageShell>
  );
}
