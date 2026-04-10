import type { Metadata } from 'next';
import { ExamplePageShell } from '../example-page-shell';
import { InspectorDefaults as Example } from './example';

export const metadata: Metadata = {
  title: 'Inspector — Defaults — Editor Examples',
  description:
    'Zero-config inspector sidebar. All three inspectors render sensible defaults when no children are passed.',
  alternates: { canonical: '/editor/examples/inspector-defaults' },
};

export default function Page() {
  return (
    <ExamplePageShell
      slug="inspector-defaults"
      title="Inspector — Defaults"
      docsUrl="https://react.email/docs/editor/overview"
    >
      <Example />
    </ExamplePageShell>
  );
}
