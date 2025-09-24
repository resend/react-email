import http from 'node:http';
import path from 'node:path';
import url from 'node:url';
import { styleText } from 'node:util';
import { createJiti } from 'jiti';
import logSymbols from 'log-symbols';
import ora from 'ora';
import { registerSpinnerAutostopping } from '../../utils/register-spinner-autostopping.js';
import { getPreviewServerLocation } from '../get-preview-server-location.js';
import { packageJson } from '../packageJson.js';
import { getEnvVariablesForPreviewApp } from './get-env-variables-for-preview-app.js';
import { serveStaticFile } from './serve-static-file.js';

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
  const [majorNodeVersion] = process.versions.node.split('.');
  if (majorNodeVersion && Number.parseInt(majorNodeVersion) < 18) {
    console.error(
      ` ${logSymbols.error}  Node ${majorNodeVersion} is not supported. Please upgrade to Node 18 or higher.`,
    );
    process.exit(1);
  }

  const previewServerLocation = await getPreviewServerLocation();
  const previewServer = createJiti(previewServerLocation);

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
        void nextReadyPromise.then(() =>
          nextHandleRequest?.(req, res, parsedUrl),
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
    console.log(
      styleText('greenBright', `    React Email ${packageJson.version}`),
    );
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
    spinner.stopAndPersist({
      symbol: logSymbols.error,
      text: `Preview Server had an error: ${e}`,
    });
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
      previewServerLocation,
      process.cwd(),
    ),
  };

  const next = await previewServer.import<typeof import('next')['default']>(
    'next',
    {
      default: true,
    },
  );

  const app = next({
    // passing in env here does not get the environment variables there
    dev: false,
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
  try {
    await nextReadyPromise;
  } catch (exception) {
    spinner.stopAndPersist({
      symbol: logSymbols.error,
      text: ` Preview Server had an error: ${exception}`,
    });
    process.exit(1);
  }
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
  (codeSignalOrError: number | NodeJS.Signals | Error) => {
    if (typeof devServer !== 'undefined') {
      console.log('\nshutting down dev server');
      devServer.close();
      devServer = undefined;
    }

    if (codeSignalOrError instanceof Error) {
      console.error(codeSignalOrError);
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
