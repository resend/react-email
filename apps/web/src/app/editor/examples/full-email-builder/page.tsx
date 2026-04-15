import type { Metadata } from 'next';
import { ExamplePageShell } from '../example-page-shell';
import { FullEmailBuilder as Example } from './example';

export const metadata: Metadata = {
  title: 'Full Email Builder — Editor Examples',
  description:
    'All components combined: bubble menus, slash commands, theming, inspector sidebar, and export.',
  alternates: { canonical: '/editor/examples/full-email-builder' },
};

export default function Page() {
  return (
    <ExamplePageShell
      slug="full-email-builder"
      title="Full Email Builder"
      docsUrl="/docs/editor/features/email-export"
    >
      <Example />
    </ExamplePageShell>
  );
}
