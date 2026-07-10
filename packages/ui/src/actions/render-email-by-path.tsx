'use server';

import fs from 'node:fs';
import path from 'node:path';
import logSymbols from 'log-symbols';
import type React from 'react';
import { pretty, toPlainText } from 'react-email';
import {
  isBuilding,
  isPreviewDevelopment,
  previewServerLocation,
  userProjectLocation,
} from '../app/env';
import { convertStackWithSourceMap } from '../utils/convert-stack-with-sourcemap';
import { createJsxRuntime } from '../utils/create-jsx-runtime';
import { getEmailComponent } from '../utils/get-email-component';
import { isPathWithinEmailsDirectory } from '../utils/is-path-within-emails-directory';
import { registerSpinnerAutostopping } from '../utils/register-spinner-autostopping';
import {
  createSpinner,
  type Spinner,
  stopSpinnerAndPersist,
} from '../utils/spinner';
import { styleText } from '../utils/style-text';
import type { ErrorObject } from '../utils/types/error-object';

export interface RenderedEmailMetadata {
  /**
   * JSON-safe props this render used: the `previewPropsOverride` when one was
   * given, otherwise the template's own `PreviewProps`.
   */
  previewProps: Record<string, unknown>;
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

const getCacheKey = (
  emailPath: string,
  previewPropsOverride: Record<string, unknown> | undefined,
) =>
  previewPropsOverride === undefined
    ? emailPath
    : `${emailPath}\0${JSON.stringify(previewPropsOverride)}`;

const invalidateCacheFor = (emailPath: string) => {
  for (const key of cache.keys()) {
    if (key === emailPath || key.startsWith(`${emailPath}\0`)) {
      cache.delete(key);
    }
  }
};

// Drops every cached render of a template (its defaults and any props-override
// variants) so the next render re-reads the file. Hot reload uses this to
// invalidate templates affected by a shared-component save without re-rendering
// them eagerly.
export const invalidateEmailRenderingCache = async (emailPath: string) => {
  if (!isPathWithinEmailsDirectory(emailPath)) return;
  invalidateCacheFor(emailPath);
};

const toJsonSafeProps = (props: unknown): Record<string, unknown> => {
  try {
    const serialized = JSON.parse(JSON.stringify(props)) as unknown;
    if (
      serialized !== null &&
      typeof serialized === 'object' &&
      !Array.isArray(serialized)
    ) {
      return serialized as Record<string, unknown>;
    }
  } catch (_exception) {
    // Props containing non-serializable values (functions, elements) cannot
    // round-trip into the editor; fall through to an empty object.
  }
  return {};
};

const createLogBufferer = (
  originalLogger: (...args: any[]) => void,
  overwriteLogger: (logger: (...args: any[]) => void) => void,
) => {
  let logs: Array<any[]> = [];

  let timesCorked = 0;

  return {
    buffer: () => {
      timesCorked += 1;
      overwriteLogger((...args: any[]) => logs.push(args));
    },
    flush: () => {
      timesCorked = Math.max(timesCorked - 1, 0);
      // This ensures that, only once flushing has been called as many times as
      // buffering, that the logs are actually flushed.
      if (timesCorked === 0) {
        for (const logArgs of logs) {
          originalLogger(...logArgs);
        }
        logs = [];
        overwriteLogger(originalLogger);
      }
    },
  };
};

const logBufferer = createLogBufferer(
  console.log,
  (logger) => (console.log = logger),
);
const errorBufferer = createLogBufferer(
  console.error,
  (logger) => (console.error = logger),
);
const infoBufferer = createLogBufferer(
  console.info,
  (logger) => (console.info = logger),
);
const warnBufferer = createLogBufferer(
  console.warn,
  (logger) => (console.warn = logger),
);

export const renderEmailByPath = async (
  emailPath: string,
  invalidatingCache = false,
  previewPropsOverride?: Record<string, unknown>,
): Promise<EmailRenderingResult> => {
  if (!isPathWithinEmailsDirectory(emailPath)) {
    return {
      error: {
        name: 'Error',
        message: `Refusing to render ${path.basename(emailPath)} because it resolves outside of the configured emails directory.`,
        stack: undefined,
      },
    };
  }

  if (invalidatingCache) {
    invalidateCacheFor(emailPath);
  }

  const cacheKey = getCacheKey(emailPath, previewPropsOverride);
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey)!;
  }

  const emailFilename = path.basename(emailPath);
  let spinner: Spinner | undefined;
  if (!isBuilding && !isPreviewDevelopment) {
    logBufferer.buffer();
    errorBufferer.buffer();
    infoBufferer.buffer();
    warnBufferer.buffer();
    spinner = createSpinner({
      text: `Rendering email template ${emailFilename}\n`,
      prefixText: ' ',
      stream: process.stderr,
    });
    spinner.start();
    registerSpinnerAutostopping(spinner);
  }

  if (path.extname(emailPath) === '.html') {
    const renderingResult = await renderRawHtmlEmailByPath(emailPath);
    if ('error' in renderingResult) {
      stopSpinnerAndPersist(spinner, {
        symbol: logSymbols.error,
        text: `Failed while rendering ${emailFilename}`,
      });
    } else {
      stopSpinnerAndPersist(spinner, {
        symbol: logSymbols.success,
        text: `Successfully rendered ${emailFilename}`,
      });
    }
    logBufferer.flush();
    errorBufferer.flush();
    infoBufferer.flush();
    warnBufferer.flush();

    if (!('error' in renderingResult)) {
      cache.set(cacheKey, renderingResult);
    }

    return renderingResult;
  }

  const originalJsxRuntimePath = path.resolve(
    previewServerLocation,
    'jsx-runtime',
  );
  const jsxRuntimePath = await createJsxRuntime(
    userProjectLocation,
    originalJsxRuntimePath,
  );

  const timeBeforeEmailBundled = performance.now();
  const componentResult = await getEmailComponent(emailPath, jsxRuntimePath);
  const millisecondsToBundled = performance.now() - timeBeforeEmailBundled;

  if ('error' in componentResult) {
    stopSpinnerAndPersist(spinner, {
      symbol: logSymbols.error,
      text: `Failed while rendering ${emailFilename}`,
    });
    logBufferer.flush();
    errorBufferer.flush();
    infoBufferer.flush();
    warnBufferer.flush();
    return { error: componentResult.error };
  }

  const {
    emailComponent: Email,
    createElement,
    render,
    renderWithReferences,
    sourceMapToOriginalFile,
  } = componentResult;

  const previewProps = previewPropsOverride ?? Email.PreviewProps ?? {};
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
    stopSpinnerAndPersist(spinner, {
      symbol: logSymbols.success,
      text: `Successfully rendered ${emailFilename} in ${timeForConsole} (bundled in ${millisecondsToBundled.toFixed(0)}ms)`,
    });
    logBufferer.flush();
    errorBufferer.flush();
    infoBufferer.flush();
    warnBufferer.flush();

    const renderingResult: RenderedEmailMetadata = {
      previewProps: toJsonSafeProps(previewProps),
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

    cache.set(cacheKey, renderingResult);

    return renderingResult;
  } catch (exception) {
    const error = exception as Error;

    stopSpinnerAndPersist(spinner, {
      symbol: logSymbols.error,
      text: `Failed while rendering ${emailFilename}`,
    });
    logBufferer.flush();
    errorBufferer.flush();
    infoBufferer.flush();
    warnBufferer.flush();

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

const renderRawHtmlEmailByPath = async (
  emailPath: string,
): Promise<EmailRenderingResult> => {
  try {
    const source = await fs.promises.readFile(emailPath, 'utf-8');
    const markup = source.replaceAll('\0', '');

    let prettyMarkup = markup;
    try {
      prettyMarkup = await pretty(markup);
    } catch (_) {
      // Fall back to the raw markup if prettier cannot parse the HTML so the
      // preview still renders something the user can iterate on.
    }

    const plainText = toPlainText(markup);

    return {
      previewProps: {},
      prettyMarkup,
      markup,
      plainText,
      reactMarkup: source,

      basename: path.basename(emailPath, path.extname(emailPath)),
      extname: path.extname(emailPath).slice(1),
    };
  } catch (exception) {
    const error = exception as Error;
    return {
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
        cause: error.cause
          ? JSON.parse(JSON.stringify(error.cause))
          : undefined,
      },
    };
  }
};
