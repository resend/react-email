import chalk from 'chalk';

import pkg from '../../../package.json';

import { CommandFn } from '../types';

export const help = chalk`
{blue ${pkg.name}} v${pkg.version}

Starts the preview server for a directory of email templates

{underline Usage}
  $ email preview <template dir path> [...options]

{underline Options}
  --port     The local port number the preview server should run on

{underline Examples}
  $ email preview ./src/templates --port 55420
`;

export const command: CommandFn = async (_, __) => true;
