'use server';
import fs from 'node:fs';
import path from 'node:path';
import chalk from 'chalk';
import logSymbols from 'log-symbols';
import ora from 'ora';
import { improveErrorWithSourceMap } from '../utils/improve-error-with-sourcemap';
import { registerSpinnerAutostopping } from '../utils/register-spinner-autostopping';
import type { ErrorObject } from '../utils/types/error-object';
import { cachedGetEmailComponent } from '../utils/cached-get-email-component';

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

const renderingResultCache = new Map<string, EmailRenderingResult>();

// eslint-disable-next-line @typescript-eslint/require-await
export const invalidateRenderingCache = async (emailPath: string) => {
  renderingResultCache.delete(emailPath);
};

export const renderEmailByPath = async (
  emailPath: string,
  props: object,
  invalidatingCache = false,
): Promise<EmailRenderingResult> => {
  if (invalidatingCache) renderingResultCache.delete(emailPath);

  if (renderingResultCache.has(emailPath))
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return renderingResultCache.get(emailPath)!;
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

  const componentResult = await cachedGetEmailComponent(emailPath);

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

  const EmailComponent = Email as React.FC;
  try {
    const markup = await render(createElement(EmailComponent, props), {
      pretty: true,
    });
    const plainText = await render(createElement(EmailComponent, props), {
      plainText: true,
    });

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
      // This ensures that no null byte character ends up in the rendered
      // markup making users suspect of any issues. These null byte characters
      // only seem to happen with React 18, as it has no similar incident with React 19.
      markup: markup.replaceAll('\0', ''),
      plainText,
      reactMarkup,
    };

    renderingResultCache.set(emailPath, renderingResult);

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
