'use server';

import fs from 'node:fs';
import path from 'node:path';
import logSymbols from 'log-symbols';
import ora, { type Ora } from 'ora';
import type React from 'react';
import {
  isBuilding,
  isPreviewDevelopment,
  previewServerLocation,
  userProjectLocation,
} from '../app/env';
import { convertStackWithSourceMap } from '../utils/convert-stack-with-sourcemap';
import { createJsxRuntime } from '../utils/create-jsx-runtime';
import { getEmailComponent } from '../utils/get-email-component';
import { registerSpinnerAutostopping } from '../utils/register-spinner-autostopping';
import { styleText } from '../utils/style-text';
import type { ErrorObject } from '../utils/types/error-object';

export interface RenderedEmailMetadata {
  prettyMarkup: string;
  markup: string;
  /**
   * HTML markup with `data-source-file` and `data-source-line` attributes pointing to the original
   * .jsx/.tsx files corresponding to the rendered tag
   */
  markupWithReferences?: string;
  plainText: string;
  reactMarkup: string;

  basename: string;
  extname: string;
}

export type EmailRenderingResult =
  | RenderedEmailMetadata
  | {
      error: ErrorObject;
    };

const cache = new Map<string, EmailRenderingResult>();

const createLogBufferer = (log: (...args: any[]) => void) => {
  let logs: Array<any[]> = [];

  const bufferer = {
    log: (...args: any[]) => {
      logs.push(args);
    },
    original: log,
    flush: () => {
      for (const logArgs of logs) {
        log(...logArgs);
      }
      logs = [];
    },
  };

  return bufferer;
};

const {
  log,
  flush: flushLog,
  original: originalLog,
} = createLogBufferer(console.log);
const {
  log: error,
  flush: flushError,
  original: originalError,
} = createLogBufferer(console.error);
const {
  log: info,
  flush: flushInfo,
  original: originalInfo,
} = createLogBufferer(console.info);
const {
  log: warn,
  flush: flushWarn,
  original: originalWarn,
} = createLogBufferer(console.warn);

export const renderEmailByPath = async (
  emailPath: string,
  invalidatingCache = false,
): Promise<EmailRenderingResult> => {
  if (invalidatingCache) {
    cache.delete(emailPath);
  }

  if (cache.has(emailPath)) {
    return cache.get(emailPath)!;
  }

  console.log = log;
  console.info = info;
  console.error = error;
  console.warn = warn;

  const emailFilename = path.basename(emailPath);
  let spinner: Ora | undefined;
  if (!isBuilding && !isPreviewDevelopment) {
    spinner = ora({
      text: `Rendering email template ${emailFilename}\n`,
      prefixText: ' ',
      stream: process.stderr,
    }).start();
    registerSpinnerAutostopping(spinner);
  }

  const timeBeforeEmailBundled = performance.now();
  const originalJsxRuntimePath = path.resolve(
    previewServerLocation,
    'jsx-runtime',
  );
  const jsxRuntimePath = await createJsxRuntime(
    userProjectLocation,
    originalJsxRuntimePath,
  );
  const componentResult = await getEmailComponent(emailPath, jsxRuntimePath);
  const millisecondsToBundled = performance.now() - timeBeforeEmailBundled;

  if ('error' in componentResult) {
    spinner?.stopAndPersist({
      symbol: logSymbols.error,
      text: `Failed while rendering ${emailFilename}`,
    });
    flushLog();
    console.log = originalLog;
    flushError();
    console.error = originalError;
    flushInfo();
    console.info = originalInfo;
    flushWarn();
    console.warn = originalWarn;
    return { error: componentResult.error };
  }

  const {
    emailComponent: Email,
    createElement,
    render,
    renderWithReferences,
    sourceMapToOriginalFile,
  } = componentResult;

  const previewProps = Email.PreviewProps || {};
  const EmailComponent = Email as React.FunctionComponent;
  try {
    const timeBeforeEmailRendered = performance.now();
    const element = createElement(EmailComponent, previewProps);
    const markupWithReferences = await renderWithReferences(element, {
      pretty: true,
    });
    const prettyMarkup = await render(element, {
      pretty: true,
    });
    const markup = await render(element, {
      pretty: false,
    });
    const plainText = await render(element, {
      plainText: true,
    });

    const reactMarkup = await fs.promises.readFile(emailPath, 'utf-8');

    const millisecondsToRendered = performance.now() - timeBeforeEmailRendered;
    let timeForConsole = `${millisecondsToRendered.toFixed(0)}ms`;
    if (millisecondsToRendered <= 450) {
      timeForConsole = styleText('green', timeForConsole);
    } else if (millisecondsToRendered <= 1000) {
      timeForConsole = styleText('yellow', timeForConsole);
    } else {
      timeForConsole = styleText('red', timeForConsole);
    }
    spinner?.stopAndPersist({
      symbol: logSymbols.success,
      text: `Successfully rendered ${emailFilename} in ${timeForConsole} (bundled in ${millisecondsToBundled.toFixed(0)}ms)`,
    });
    flushLog();
    console.log = originalLog;
    flushError();
    console.error = originalError;
    flushInfo();
    console.info = originalInfo;
    flushWarn();
    console.warn = originalWarn;

    const renderingResult: RenderedEmailMetadata = {
      prettyMarkup,
      // This ensures that no null byte character ends up in the rendered
      // markup making users suspect of any issues. These null byte characters
      // only seem to happen with React 18, as it has no similar incident with React 19.
      markup: markup.replaceAll('\0', ''),
      markupWithReferences: markupWithReferences.replaceAll('\0', ''),
      plainText,
      reactMarkup,

      basename: path.basename(emailPath, path.extname(emailPath)),
      extname: path.extname(emailPath).slice(1),
    };

    cache.set(emailPath, renderingResult);

    return renderingResult;
  } catch (exception) {
    const error = exception as Error;

    spinner?.stopAndPersist({
      symbol: logSymbols.error,
      text: `Failed while rendering ${emailFilename}`,
    });
    flushLog();
    console.log = originalLog;
    flushError();
    console.error = originalError;
    flushInfo();
    console.info = originalInfo;
    flushWarn();
    console.warn = originalWarn;

    if (exception instanceof SyntaxError) {
      interface SpanPosition {
        file: {
          content: string;
        };
        offset: number;
        line: number;
        col: number;
      }
      // means the email's HTML was invalid and prettier threw this error
      // TODO: always throw when the HTML is invalid during `render`
      const cause = exception.cause as {
        msg: string;
        span: {
          start: SpanPosition;
          end: SpanPosition;
        };
      };

      const sourceFileAttributeMatches = cause.span.start.file.content.matchAll(
        /data-source-file="(?<file>[^"]*)"/g,
      );
      let closestSourceFileAttribute: RegExpExecArray | undefined;
      for (const sourceFileAttributeMatch of sourceFileAttributeMatches) {
        if (closestSourceFileAttribute === undefined) {
          closestSourceFileAttribute = sourceFileAttributeMatch;
        }
        if (
          Math.abs(sourceFileAttributeMatch.index - cause.span.start.offset) <
          Math.abs(closestSourceFileAttribute.index - cause.span.start.offset)
        ) {
          closestSourceFileAttribute = sourceFileAttributeMatch;
        }
      }

      const findClosestAttributeValue = (
        attributeName: string,
      ): string | undefined => {
        const attributeMatches = cause.span.start.file.content.matchAll(
          new RegExp(`${attributeName}="(?<value>[^"]*)"`, 'g'),
        );
        let closestAttribute: RegExpExecArray | undefined;
        for (const attributeMatch of attributeMatches) {
          if (closestAttribute === undefined) {
            closestAttribute = attributeMatch;
          }
          if (
            Math.abs(attributeMatch.index - cause.span.start.offset) <
            Math.abs(closestAttribute.index - cause.span.start.offset)
          ) {
            closestAttribute = attributeMatch;
          }
        }
        return closestAttribute?.groups?.value;
      };

      let stack = convertStackWithSourceMap(
        error.stack,
        emailPath,
        sourceMapToOriginalFile,
      );

      const sourceFile = findClosestAttributeValue('data-source-file');
      const sourceLine = findClosestAttributeValue('data-source-line');
      if (sourceFile && sourceLine) {
        stack = ` at ${sourceFile}:${sourceLine}\n${stack}`;
      }

      return {
        error: {
          name: exception.name,
          message: cause.msg,
          stack,
          cause: error.cause ? JSON.parse(JSON.stringify(cause)) : undefined,
        },
      };
    }

    return {
      error: {
        name: error.name,
        message: error.message,
        stack: convertStackWithSourceMap(
          error.stack,
          emailPath,
          sourceMapToOriginalFile,
        ),
        cause: error.cause
          ? JSON.parse(JSON.stringify(error.cause))
          : undefined,
      },
    };
  }
};
