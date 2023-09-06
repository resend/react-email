import chalk from 'chalk';

import pkg from '../../package.json';

import { CommandFn } from './types';
import { help as build } from './build';
import { help as create } from './create';
// import { help as preview } from './preview';

const { log } = console;

export const helpMessage = chalk`
{blue ${pkg.name}} v${pkg.version}

${pkg.description}

{underline Usage}
  $ email [...options]

{underline Commands}
  build       {dim <template path>}
  help        [{dim <command>}]

{underline Options}
  --help      Displays this message
  --version   Displays webpack-nano and webpack versions

{underline Examples}
  $ email
  $ email --help
  $ email build ./src/templates/Invite.tsx
  $ email create invite
`;

// Stash this until we write the command
// preview     {dim <template dir path>}
// $ email preview ./src/templates

// , preview };
const commands: Record<string, string> = { build, create };

export const command: CommandFn = async (_, inputs) => {
  if ((inputs || []).length < 1) {
    log(helpMessage);
    return true;
  }

  const [command] = inputs;
  const commandHelp = commands[command] || helpMessage;

  log(commandHelp);

  return true;
};
