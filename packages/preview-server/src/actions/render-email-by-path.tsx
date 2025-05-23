'use server';
import fs from 'node:fs';
import path from 'node:path';
import chalk from 'chalk';
import logSymbols from 'log-symbols';
import ora, { type Ora } from 'ora';
import { isBuilding, isPreviewDevelopment } from '../app/env';
import { getEmailComponent } from '../utils/get-email-component';
import { improveErrorWithSourceMap } from '../utils/improve-error-with-sourcemap';
import { registerSpinnerAutostopping } from '../utils/register-spinner-autostopping';
import type { ErrorObject } from '../utils/types/error-object';

export interface RenderedEmailMetadata {
  markup: string;
  plainText: string;
  reactMarkup: string;
}

export type EmailRenderingResult =
  | RenderedEmailMetadata
  | {
      error: ErrorObject;
    };

const cache = new Map<string, EmailRenderingResult>();

export const renderEmailByPath = async (
  emailPath: string,
  invalidatingCache = false,
): Promise<EmailRenderingResult> => {
  if (invalidatingCache) cache.delete(emailPath);
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  if (cache.has(emailPath)) return cache.get(emailPath)!;

  const timeBeforeEmailRendered = performance.now();

  const emailFilename = path.basename(emailPath);
  let spinner: Ora | undefined;
  if (!isBuilding && !isPreviewDevelopment) {
    spinner = ora({
      text: `Rendering email template ${emailFilename}\n`,
      prefixText: ' ',
    }).start();
    registerSpinnerAutostopping(spinner);
  }

  const componentResult = await getEmailComponent(emailPath);

  if ('error' in componentResult) {
    spinner?.stopAndPersist({
      symbol: logSymbols.error,
      text: `Failed while rendering ${emailFilename}`,
    });
    return { error: componentResult.error };
  }

  const {
    emailComponent: Email,
    createElement,
    render,
    sourceMapToOriginalFile,
  } = componentResult;

  const previewProps = Email.PreviewProps || {};
  const EmailComponent = Email as React.FC;
  try {
    const markup = await render(createElement(EmailComponent, previewProps), {
      pretty: true,
    });
    const plainText = await render(
      createElement(EmailComponent, previewProps),
      {
        plainText: true,
      },
    );

    const reactMarkup = await fs.promises.readFile(emailPath, 'utf-8');

    const millisecondsToRendered = performance.now() - timeBeforeEmailRendered;
    let timeForConsole = `${millisecondsToRendered.toFixed(0)}ms`;
    if (millisecondsToRendered <= 450) {
      timeForConsole = chalk.green(timeForConsole);
    } else if (millisecondsToRendered <= 1000) {
      timeForConsole = chalk.yellow(timeForConsole);
    } else {
      timeForConsole = chalk.red(timeForConsole);
    }
    spinner?.stopAndPersist({
      symbol: logSymbols.success,
      text: `Successfully rendered ${emailFilename} in ${timeForConsole}`,
    });

    const renderingResult = {
      // This ensures that no null byte character ends up in the rendered
      // markup making users suspect of any issues. These null byte characters
      // only seem to happen with React 18, as it has no similar incident with React 19.
      markup: markup.replaceAll('\0', ''),
      plainText,
      reactMarkup,
    };

    cache.set(emailPath, renderingResult);

    return renderingResult;
  } catch (exception) {
    const error = exception as Error;

    spinner?.stopAndPersist({
      symbol: logSymbols.error,
      text: `Failed while rendering ${emailFilename}`,
    });

    return {
      error: improveErrorWithSourceMap(
        error,
        emailPath,
        sourceMapToOriginalFile,
      ),
    };
  }
};
