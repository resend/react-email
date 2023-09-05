import { parseArgs } from 'node:util';

import debugConfig from 'debug';
import importLocal from 'import-local';

import pkg from '../package.json';

import { command as build } from './commands/build';
import { command as help } from './commands/help';
import { command as preview } from './commands/preview';
import { CommandFn } from './commands/types';

const commands: Record<string, CommandFn> = { build, help, preview };
const debug = debugConfig('@jsx-email/cli');
const { log } = console;

const run = () => {
  const argv = parseArgs({ allowPositionals: true, args: process.argv.slice(2), strict: false });
  const [commandName] = argv.positionals;
  let command = commands[commandName];

  if (argv.values.version) {
    log(`${pkg.name} v${pkg.version}\n`);
  }

  if (!command) command = help;

  command(argv.values, argv.positionals || []);
};

if (importLocal(__filename)) {
  debug('Using local install of webpack-command');
} else {
  run();
}
