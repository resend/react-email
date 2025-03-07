'use server';
import path from 'node:path';
import chalk from 'chalk';
import logSymbols from 'log-symbols';
import ora from 'ora';
import { improveErrorWithSourceMap } from '../utils/improve-error-with-sourcemap';
import { registerSpinnerAutostopping } from '../utils/register-spinner-autostopping';
import type { ErrorObject } from '../utils/types/error-object';
import { getEmailComponent } from './build-email-component';
import { type Result, ok, err } from '../utils/result';

export interface RenderedEmailMetadata {
  markup: string;
  plainText: string;
  reactMarkup: string;
}

export type EmailRenderingResult = Result<
  RenderedEmailMetadata,
  | { type: 'EMAIL_COMPONENT_NOT_BUILT' }
  | { type: 'RENDERING_FAILURE'; exception: ErrorObject }
>;

export const renderEmail = async (
  emailSlug: string,
  props: object,
): Promise<EmailRenderingResult> => {
  const timeBeforeEmailRendered = performance.now();

  const emailFilename = path.basename(emailSlug);

  const spinner = ora({
    text: `Rendering email template ${emailFilename}\n`,
    prefixText: ' ',
  }).start();
  registerSpinnerAutostopping(spinner);

  const emailComponent = await getEmailComponent(emailSlug);

  if (emailComponent === undefined) {
    spinner.stopAndPersist({
      symbol: logSymbols.error,
      text: `Failed while rendering ${emailFilename}`,
    });
    return err({ type: 'EMAIL_COMPONENT_NOT_BUILT' });
  }

  const {
    createElement,
    emailComponent: Email,
    emailPath,
    fileContents: reactMarkup,
    render,
    sourceMap,
  } = emailComponent;

  const EmailComponent = Email as React.FC;
  try {
    const markup = await render(createElement(EmailComponent, props), {
      pretty: true,
    });
    const plainText = await render(createElement(EmailComponent, props), {
      plainText: true,
    });

    const milisecondsToRendered = performance.now() - timeBeforeEmailRendered;
    let timeForConsole = `${milisecondsToRendered.toFixed(0)}ms`;
    if (milisecondsToRendered <= 450) {
      timeForConsole = chalk.green(timeForConsole);
    } else if (milisecondsToRendered <= 1000) {
      timeForConsole = chalk.yellow(timeForConsole);
    } else {
      timeForConsole = chalk.red(timeForConsole);
    }
    spinner.stopAndPersist({
      symbol: logSymbols.success,
      text: `Successfully rendered ${emailFilename} in ${timeForConsole}`,
    });

    return ok({
      // This ensures that no null byte character ends up in the rendered
      // markup making users suspect of any issues. These null byte characters
      // only seem to happen with React 18, as it has no similar incident with React 19.
      markup: markup.replaceAll('\0', ''),
      plainText,
      reactMarkup,
    });
  } catch (exception) {
    const error = exception as Error;

    spinner.stopAndPersist({
      symbol: logSymbols.error,
      text: `Failed while rendering ${emailFilename}`,
    });

    return err({
      type: 'RENDERING_FAILURE',
      exception: improveErrorWithSourceMap(
        error,
        emailPath,
        sourceMap,
      ),
    });
  }
};
