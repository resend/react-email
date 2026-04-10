import type { Metadata } from 'next';
import { EmailThemingExample as Example } from '../dynamic-imports';
import { ExamplePageShell } from '../example-page-shell';

export const metadata: Metadata = {
  title: 'Email Theming — Editor Examples',
  description:
    'Switch between Basic and Minimal themes to see how email styles change.',
  alternates: { canonical: '/editor/examples/email-theming' },
};

export default function Page() {
  return (
    <ExamplePageShell
      slug="email-theming"
      title="Email Theming"
      docsUrl="https://react.email/docs/editor/features/theming"
    >
      <Example />
    </ExamplePageShell>
  );
}
