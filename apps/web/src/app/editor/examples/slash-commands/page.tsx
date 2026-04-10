import type { Metadata } from 'next';
import { SlashCommands as Example } from '../dynamic-imports';
import { ExamplePageShell } from '../example-page-shell';

export const metadata: Metadata = {
  title: 'Slash Commands — Editor Examples',
  description:
    'Type / to open the command menu. Includes default commands plus a custom "Greeting" command.',
  alternates: { canonical: '/editor/examples/slash-commands' },
};

export default function Page() {
  return (
    <ExamplePageShell
      slug="slash-commands"
      title="Slash Commands"
      docsUrl="https://react.email/docs/editor/features/slash-commands"
    >
      <Example />
    </ExamplePageShell>
  );
}
