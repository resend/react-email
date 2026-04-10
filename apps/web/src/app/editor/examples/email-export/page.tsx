import type { Metadata } from 'next';
import { EmailExport as Example } from './example';
import { ExamplePageShell } from '../example-page-shell';

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
      docsUrl="https://react.email/docs/editor/features/email-export"
    >
      <Example />
    </ExamplePageShell>
  );
}
