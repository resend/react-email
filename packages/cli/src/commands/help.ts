import chalk from 'chalk';

import pkg from '../../package.json';

import { CommandFn } from './types';

const { log } = console;

export const helpMessage = chalk`
{blue ${pkg.name}} v${pkg.version}
${pkg.description}

{underline Usage}
  $ email [...options]

{underline Commands}
  build       {dim <template path>}
  help        [{dim <command>}]
  preview     {dim <template dir path>}

{underline Options}
  --help      Displays this message
  --version   Displays webpack-nano and webpack versions

{underline Examples}
  $ email
  $ email --help
  $ email build ./src/templates/Invite.tsx
  $ email preview ./src/templates
`;

const build = chalk`
{blue ${pkg.name}} v${pkg.version}

Builds a template and saves the result

{underline Usage}
  $ email build <template path> [...options]

{underline Options}
  --plain     Emit template as plain text
  --props     A JSON string containing props to be passed to the email template

{underline Examples}
  $ email build ./src/templates/Invite.tsx
  $ email build ./src/templates/Invite.tsx --props '{"batman": "Bruce Wayne"}'
`;

const preview = chalk`
{blue ${pkg.name}} v${pkg.version}

Starts the preview server for a directory of email templates

{underline Usage}
  $ email preview <template dir path> [...options]

{underline Options}
  --port     The local port number the preview server should run on

{underline Examples}
  $ email preview ./src/templates --port 55420
`;

const commands: Record<string, string> = { build, preview };

export const command: CommandFn = (_, inputs) => {
  if ((inputs || []).length > 1) {
    log(helpMessage);
    return;
  }

  const [, command] = inputs;
  const commandHelp = commands[command] || helpMessage;

  log(commandHelp);
};
