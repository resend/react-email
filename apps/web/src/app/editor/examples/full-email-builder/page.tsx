import type { Metadata } from 'next';
import { FullEmailBuilder as Example } from '../_components/dynamic-examples';
import { ExamplePageShell } from '../_components/example-page-shell';

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
      docsUrl="https://react.email/docs/editor/features/email-export"
    >
      <Example />
    </ExamplePageShell>
  );
}
