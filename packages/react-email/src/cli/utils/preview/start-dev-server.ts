import path from 'node:path';
import http from 'node:http';
import url from 'node:url';
import next from 'next';
import ora from 'ora';
import logSymbols from 'log-symbols';
import chalk from 'chalk';
import packageJson from '../../../../package.json';
import { registerSpinnerAutostopping } from '../../../utils/register-spinner-autostopping';
import { serveStaticFile } from './serve-static-file';
import { getEnvVariablesForPreviewApp } from './get-env-variables-for-preview-app';

let devServer: http.Server | undefined;

const safeAsyncServerListen = (server: http.Server, port: number) => {
  return new Promise<{ portAlreadyInUse: boolean }>((resolve) => {
    server.listen(port, () => {
      resolve({ portAlreadyInUse: false });
    });

    server.on('error', (e: NodeJS.ErrnoException) => {
      if (e.code === 'EADDRINUSE') {
        resolve({ portAlreadyInUse: true });
      }
    });
  });
};

export const isDev = !__filename.endsWith(path.join('cli', 'index.js'));
export const cliPacakgeLocation = isDev
  ? path.resolve(__dirname, '../../../..')
  : path.resolve(__dirname, '../..');
export const previewServerLocation = isDev
  ? path.resolve(__dirname, '../../../..')
  : path.resolve(__dirname, '../preview');

export const startDevServer = async (
  emailsDirRelativePath: string,
  staticBaseDirRelativePath: string,
  port: number,
): Promise<http.Server> => {
  devServer = http.createServer((req, res) => {
    if (!req.url) {
      res.end(404);
      return;
    }

    const parsedUrl = url.parse(req.url, true);

    // Never cache anything to avoid
    res.setHeader(
      'Cache-Control',
      'no-cache, max-age=0, must-revalidate, no-store',
    );
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '-1');

    try {
      if (
        parsedUrl.path?.includes('static/') &&
        !parsedUrl.path.includes('_next/static/')
      ) {
        void serveStaticFile(res, parsedUrl, staticBaseDirRelativePath);
      } else if (!isNextReady) {
        void nextReadyPromise.then(
          () => nextHandleRequest?.(req, res, parsedUrl),
        );
      } else {
        void nextHandleRequest?.(req, res, parsedUrl);
      }
    } catch (e) {
      console.error('caught error', e);

      res.writeHead(500);
      res.end();
    }
  });

  const { portAlreadyInUse } = await safeAsyncServerListen(devServer, port);

  if (!portAlreadyInUse) {
    // this errors when linting but doesn't on the editor so ignore the warning on this
    /* eslint-disable-next-line @typescript-eslint/no-unsafe-member-access */
    console.log(chalk.greenBright(`    React Email ${packageJson.version}`));
    console.log(`    Running preview at:          http://localhost:${port}\n`);
  } else {
    const nextPortToTry = port + 1;
    console.warn(
      ` ${logSymbols.warning} Port ${port} is already in use, trying ${nextPortToTry}`,
    );
    return startDevServer(
      emailsDirRelativePath,
      staticBaseDirRelativePath,
      nextPortToTry,
    );
  }

  devServer.on('close', async () => {
    await app.close();
  });

  devServer.on('error', (e: NodeJS.ErrnoException) => {
    console.error(
      ` ${logSymbols.error} preview server error: `,
      JSON.stringify(e),
    );
    process.exit(1);
  });

  const spinner = ora({
    text: 'Getting react-email preview server ready...\n',
    prefixText: ' ',
  }).start();

  registerSpinnerAutostopping(spinner);
  const timeBeforeNextReady = performance.now();

  // these environment variables are used on the next app
  // this is the most reliable way of communicating these paths through
  process.env = {
    NODE_ENV: 'development',
    ...(process.env as Omit<NodeJS.ProcessEnv, 'NODE_ENV'> & {
      NODE_ENV?: NodeJS.ProcessEnv['NODE_ENV'];
    }),
    ...getEnvVariablesForPreviewApp(
      // If we don't do normalization here, stuff like https://github.com/resend/react-email/issues/1354 happens.
      path.normalize(emailsDirRelativePath),
      process.cwd(),
    ),
  };
  const app = next({
    // passing in env here does not get the environment variables there
    dev: isDev,
    conf: {
      images: {
        // This is to avoid the warning with sharp
        unoptimized: true,
      },
    },
    hostname: 'localhost',
    port,
    dir: previewServerLocation,
  });

  let isNextReady = false;
  const nextReadyPromise = app.prepare();
  await nextReadyPromise;
  isNextReady = true;

  const nextHandleRequest:
    | ReturnType<typeof app.getRequestHandler>
    | undefined = app.getRequestHandler();

  const secondsToNextReady = (
    (performance.now() - timeBeforeNextReady) /
    1000
  ).toFixed(1);

  spinner.stopAndPersist({
    text: `Ready in ${secondsToNextReady}s\n`,
    symbol: logSymbols.success,
  });

  return devServer;
};

// based on https://stackoverflow.com/a/14032965
const makeExitHandler =
  (
    options?:
      | { shouldKillProcess: false }
      | { shouldKillProcess: true; killWithErrorCode: boolean },
  ) =>
  (_codeOrSignal: number | NodeJS.Signals) => {
    if (typeof devServer !== 'undefined') {
      console.log('\nshutting down dev server');
      devServer.close();
      devServer = undefined;
    }

    if (options?.shouldKillProcess) {
      process.exit(options.killWithErrorCode ? 1 : 0);
    }
  };

// do something when app is closing
process.on('exit', makeExitHandler());

// catches ctrl+c event
process.on(
  'SIGINT',
  makeExitHandler({ shouldKillProcess: true, killWithErrorCode: false }),
);

//  catches "kill pid" (for example: nodemon restart)
process.on(
  'SIGUSR1',
  makeExitHandler({ shouldKillProcess: true, killWithErrorCode: false }),
);
process.on(
  'SIGUSR2',
  makeExitHandler({ shouldKillProcess: true, killWithErrorCode: false }),
);

// catches uncaught exceptions
process.on(
  'uncaughtException',
  makeExitHandler({ shouldKillProcess: true, killWithErrorCode: true }),
);
