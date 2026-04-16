import type { Metadata } from 'next';
import { ExamplePageShell } from '../example-page-shell';
import { getExampleGitHubUrl, getExampleSource } from '../get-example-source';
import { SlashCommands as Example } from './example';

export const metadata: Metadata = {
  title: 'Slash Commands — Editor Examples',
  description:
    'Type / to open the command menu. Includes default commands plus a custom "Greeting" command.',
  alternates: { canonical: '/editor/examples/slash-commands' },
};

export default async function Page() {
  const sourceCode = await getExampleSource('slash-commands');

  return (
    <ExamplePageShell
      slug="slash-commands"
      title="Slash Commands"
      docsUrl="https://react.email/docs/editor/features/slash-commands"
      sourceCode={sourceCode}
      githubUrl={getExampleGitHubUrl('slash-commands')}
    >
      <Example />
    </ExamplePageShell>
  );
}
