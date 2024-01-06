import path from 'node:path';
import http from 'node:http';
import url from 'node:url';
import next from 'next';
import ora from 'ora';
import logSymbols from 'log-symbols';
import chalk from 'chalk';
import packageJson from '../../../../package.json';
import { closeOraOnSIGNIT } from '../close-ora-on-sigint';
import { serveStaticFile } from './serve-static-file';

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
        parsedUrl.path &&
        parsedUrl.path.includes('static/') &&
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

  devServer.on('error', (e: NodeJS.ErrnoException) => {
    console.error(
      ` ${logSymbols.error} preview server error: `,
      JSON.stringify(e),
    );
    process.exit(1);
  });

  const spinner = ora({
    text: 'Getting NextJS preview server ready...\n',
    prefixText: ' ',
  }).start();

  closeOraOnSIGNIT(spinner);
  const timeBeforeNextReady = performance.now();

  const isRunningBuilt = __filename.endsWith('cli/index.js');
  const cliPacakgeLocation = isRunningBuilt
    ? path.resolve(__dirname, '..')
    : path.resolve(__dirname, '../../../..');

  // these environment variables are used on the next app as well
  process.env.NEXT_PUBLIC_EMAILS_DIR_RELATIVE_PATH = emailsDirRelativePath;
  process.env.NEXT_PUBLIC_CLI_PACKAGE_LOCATION = cliPacakgeLocation;
  process.env.NEXT_PUBLIC_USER_PROJECT_LOCATION = process.cwd();
  const app = next({
    dev: true,
    hostname: 'localhost',
    port,
    dir: cliPacakgeLocation,
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
