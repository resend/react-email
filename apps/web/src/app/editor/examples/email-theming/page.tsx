import type { Metadata } from 'next';
import { ExamplePageShell } from '../example-page-shell';
import { EmailThemingExample as Example } from './example';

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
      docsUrl="/docs/editor/features/theming"
    >
      <Example />
    </ExamplePageShell>
  );
}
