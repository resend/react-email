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
  --plain     Emit template as plain text
  --version   Displays webpack-nano and webpack versions

{underline Examples}
  $ email
  $ email --help
  $ email build ./src/templates/Invite.tsx
  $ email preview ./src/templates
`;

export const command: CommandFn = (_, inputs) => {
  if ((inputs || []).length > 1) {
    log(helpMessage);
    return;
  }

  const [, command] = inputs;

  log(command);
};
