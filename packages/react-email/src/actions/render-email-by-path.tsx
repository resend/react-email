'use server';
import fs from 'node:fs';
import path from 'node:path';
import chalk from 'chalk';
import logSymbols from 'log-symbols';
import ora from 'ora';
import { getEmailComponent } from '../utils/get-email-component';
import { improveErrorWithSourceMap } from '../utils/improve-error-with-sourcemap';
import { registerSpinnerAutostopping } from '../utils/register-spinner-autostopping';
import type { ErrorObject } from '../utils/types/error-object';

export interface RenderedEmailMetadata {
  element: React.ReactElement;

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
  let spinner: ora.Ora | undefined;
  if (process.env.NEXT_PUBLIC_IS_BUILDING !== 'true') {
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
    const element = createElement(EmailComponent, previewProps);
    const markup = await render(element, {
      pretty: true,
    });
    const plainText = await render(
      createElement(EmailComponent, previewProps),
      {
        plainText: true,
      },
    );

    const reactMarkup = await fs.promises.readFile(emailPath, 'utf-8');

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

    const renderingResult = {
      // TODO: add some way to map between React 18 and 19 elements, as this currently is going to break
      // with React 18
      element,

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
