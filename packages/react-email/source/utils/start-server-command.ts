import { ChildProcess, spawn } from 'child_process';
import { WebSocket, WebSocketServer } from 'ws';
import path from 'node:path';
import chalk from 'chalk';

let previewServerProcess: ChildProcess | undefined;
let previewServer: WebSocketServer;
export let previewServerWSConnection: WebSocket;

export const hotreloadPreviewServer = async () => {
  if (previewServerWSConnection) {
    previewServerWSConnection.send('reload');
  } else {
    throw new Error(
      'Not able to hotrealod preview server without the websocket server running!',
    );
  }
};

export const startPreviewServer = (absoluteEmailsDir: string, port: string) => {
  const serverFilePath = path.join(
    __dirname,
    '..',
    '..',
    'client',
    'server.js',
  );

  previewServerProcess = spawn('node', [serverFilePath], {
    detached: false,
    env: { ...process.env, PORT: port, EMAILS_PATH: absoluteEmailsDir },
  });

  previewServer = new WebSocketServer({
    port: 3001,
  });
  previewServer.on('connection', (ws) => {
    previewServerWSConnection = ws;
  });

  console.info(
    `${chalk.greenBright(
      'react-email',
    )} preview server running at port ${port}`,
  );
  console.info(`\nCheck it out at http://localhost:${port}`);

  previewServerProcess.on('error', (err) =>
    console.info(`${chalk.redBright('PREVIEW SERVER ERROR')}: ${err}`),
  );
  previewServerProcess.on('close', () => (previewServerProcess = undefined));
};

export const stopPreviewServer = () => {
  return new Promise<void>((resolve) => {
    if (previewServerProcess) {
      if (previewServerWSConnection) previewServerWSConnection.close();
      if (previewServer) previewServer.close();

      previewServerProcess.kill();
      previewServerProcess.on('close', () => {
        resolve();
      });
    }
  });
};

// based on https://stackoverflow.com/a/14032965
const exitHandler: (options?: { exit?: boolean }) => NodeJS.ExitListener =
  (options) => async (code) => {
    await stopPreviewServer();
    if (options?.exit) {
      process.exit(code);
    }
  };

// do something when app is closing
process.on('exit', exitHandler());

// catches ctrl+c event
process.on('SIGINT', exitHandler({ exit: true }));

//  catches "kill pid" (for example: nodemon restart)
process.on('SIGUSR1', exitHandler({ exit: true }));
process.on('SIGUSR2', exitHandler({ exit: true }));

// catches uncaught exceptions
process.on('uncaughtException', exitHandler({ exit: true }));
