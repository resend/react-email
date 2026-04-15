import type { Metadata } from 'next';
import { ExamplePageShell } from '../example-page-shell';
import { EmailExport as Example } from './example';

export const metadata: Metadata = {
  title: 'Email Export — Editor Examples',
  description:
    'Edit content and export it as email-ready HTML using composeReactEmail().',
  alternates: { canonical: '/editor/examples/email-export' },
};

export default function Page() {
  return (
    <ExamplePageShell
      slug="email-export"
      title="Email Export"
      docsUrl="/docs/editor/features/email-export"
    >
      <Example />
    </ExamplePageShell>
  );
}
