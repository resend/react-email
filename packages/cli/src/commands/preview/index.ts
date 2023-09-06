import { join } from 'path';

import chalk from 'chalk';
import { createServer } from 'vite';

import { CommandFn } from '../types';

export const help = chalk`
{blue email preview}

Starts the preview server for a directory of email templates

{underline Usage}
  $ email preview <template dir path> [...options]

{underline Options}
  --port     The local port number the preview server should run on

{underline Examples}
  $ email preview ./src/templates --port 55420
`;

export const command: CommandFn = async (_, __) => true;

export const start = async () => {
  const config = await import('./app/vite.config');
  const server = await createServer({
    configFile: false,
    ...config,
    root: join(__dirname, 'app'),
    server: {
      port: 1337
    }
  });

  await server.listen();

  // TODO: bind CLI shortcuts. this hasn't landed in Vite yet, will be released with 5.0
  server.openBrowser();
  server.printUrls();
};
