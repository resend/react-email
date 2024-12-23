'use server';
import path from 'node:path';
import ora from 'ora';
import logSymbols from 'log-symbols';
import chalk from 'chalk';
import type { RenderedEmailMetadata } from '../package';
import { renderEmailByPath } from '../package';
import { fromError, type ErrorObject } from '../utils/types/error-object';
import { registerSpinnerAutostopping } from '../utils/register-spinner-autostopping';

export type ActionResult =
  | RenderedEmailMetadata
  | {
      error: ErrorObject;
    };

const action = async (emailPath: string): Promise<ActionResult> => {
  const timeBeforeEmailRendered = performance.now();

  const emailFilename = path.basename(emailPath);
  let spinner: ora.Ora | undefined;
  if (process.env.NEXT_PUBLIC_IS_BUILDING !== 'true') {
    spinner = ora({
      text: `Rendering email template ${emailFilename}\n`,
      prefixText: ' ',
    }).start();
    registerSpinnerAutostopping(spinner);
  }

  const result = await renderEmailByPath(emailPath);

  if ('error' in result) {
    spinner?.stopAndPersist({
      symbol: logSymbols.error,
      text: `Failed while rendering ${emailFilename}`,
    });
    return { error: fromError(result.error) };
  }

  const milisecondsToRendered = performance.now() - timeBeforeEmailRendered;
  let timeForConsole = `${milisecondsToRendered.toFixed(0)}ms`;
  if (milisecondsToRendered <= 450) {
    timeForConsole = chalk.green(timeForConsole);
  } else if (milisecondsToRendered <= 1000) {
    timeForConsole = chalk.yellow(timeForConsole);
  } else {
    timeForConsole = chalk.red(timeForConsole);
  }
  spinner?.stopAndPersist({
    symbol: logSymbols.success,
    text: `Successfully rendered ${emailFilename} in ${timeForConsole}`,
  });

  return result;
};

export { action as renderEmailByPath };
