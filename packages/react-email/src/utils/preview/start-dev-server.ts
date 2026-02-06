import { type ChildProcess, spawn } from 'node:child_process';
import path from 'node:path';
import logSymbols from 'log-symbols';
import ora from 'ora';
import { registerSpinnerAutostopping } from '../../utils/register-spinner-autostopping.js';
import { conf } from '../conf.js';
import { getPreviewServerLocation } from '../get-preview-server-location.js';
import { getEnvVariablesForPreviewApp } from './get-env-variables-for-preview-app.js';

let appProcess: ChildProcess | undefined;

export const startDevServer = async (
  emailsDirRelativePath: string,
  staticBaseDirRelativePath: string,
  port: number,
): Promise<ChildProcess> => {
  const [majorNodeVersion] = process.versions.node.split('.');
  if (majorNodeVersion && Number.parseInt(majorNodeVersion, 10) < 20) {
    console.error(
      ` ${logSymbols.error}  Node ${majorNodeVersion} is not supported. Please upgrade to Node 20 or higher.`,
    );
    process.exit(1);
  }

  const previewServerLocation = await getPreviewServerLocation();

  const spinner = ora({
    text: 'Getting react-email preview server ready...\n',
    prefixText: ' ',
  }).start();

  registerSpinnerAutostopping(spinner);
  const timeBeforeNextReady = performance.now();

  appProcess = spawn(
    process.execPath,
    [path.resolve(previewServerLocation, '.next/standalone/server.js')],
    {
      shell: true,
      stdio: 'inherit',
      env: {
        NODE_ENV: 'development',
        PORT: port.toString(),
        ...(process.env as Omit<NodeJS.ProcessEnv, 'NODE_ENV'> & {
          NODE_ENV?: NodeJS.ProcessEnv['NODE_ENV'];
        }),
        ...getEnvVariablesForPreviewApp(
          // If we don't do normalization here, stuff like https://github.com/resend/react-email/issues/1354 happens.
          path.normalize(emailsDirRelativePath),
          previewServerLocation,
          process.cwd(),
          conf.get('resendApiKey'),
        ),
      },
    },
  );

  appProcess.on('error', (err) => {
    spinner.stopAndPersist({
      symbol: logSymbols.error,
      text: ` Preview Server had an error: ${err}`,
    });
  });

  const secondsToNextReady = (
    (performance.now() - timeBeforeNextReady) /
    1000
  ).toFixed(1);

  spinner.stopAndPersist({
    text: `Ready in ${secondsToNextReady}s\n`,
    symbol: logSymbols.success,
  });

  return appProcess;
};

// based on https://stackoverflow.com/a/14032965
const makeExitHandler =
  (
    options?:
      | { shouldKillProcess: false }
      | { shouldKillProcess: true; killWithErrorCode: boolean },
  ) =>
    (codeSignalOrError: number | NodeJS.Signals | Error) => {
      const isError = codeSignalOrError instanceof Error;
      if (typeof appProcess !== 'undefined') {
        console.log('\nshutting down dev server');
        if (!isError) {
          appProcess.kill(codeSignalOrError);
        }
        appProcess = undefined;
      }

      if (isError) {
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
