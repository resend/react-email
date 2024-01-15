/* eslint-disable @typescript-eslint/no-non-null-assertion */
// import path from 'node:path';
import vm from 'node:vm';
import stream from 'node:stream';
import util from 'node:util';
import * as stackTraceParser from 'stacktrace-parser';
import { SourceMapConsumer, type RawSourceMap } from 'source-map-js';
import { type OutputFile, build, type BuildFailure } from 'esbuild';
import type { EmailTemplate as EmailComponent } from './types/email-template';
import type { ErrorObject } from './types/error-object';

export const getEmailComponent = async (
  emailPath: string,
): Promise<
  | {
      emailComponent: EmailComponent;
    }
  | { error: ErrorObject }
> => {
  let outputFiles: OutputFile[];
  try {
    const buildData = await build({
      bundle: true,
      entryPoints: [emailPath],
      platform: 'node',
      write: false,
      format: 'cjs',
      // allows for using jsx on a .js file
      loader: {
        '.js': 'jsx',
      },
      jsx: 'transform',
      outdir: 'stdout', // just a stub for esbuild, it won't actually write to this folder
      sourcemap: 'external',
    });
    outputFiles = buildData.outputFiles;
  } catch (exception) {
    const buildFailure = exception as BuildFailure;
    return {
      error: {
        message: buildFailure.message,
        stack: buildFailure.stack,
        name: buildFailure.name,
        cause: buildFailure.cause,
      },
    };
  }

  const sourceMapFile = outputFiles[0]!;
  const bundledEmailFile = outputFiles[1]!;
  const builtEmailCode = bundledEmailFile.text;

  // This is necessary because the requires of these modules break when we run the email with vm.
  // So what we do is pre-import and return it on the fake require function we pass to the VM's context
  const nodeModuleMapToPreImported = {
    stream,
    util,
  };

  const fakeContext = {
    module: { exports: { default: undefined as unknown } },
    setTimeout,
    require: (module: string) => {
      if (module in nodeModuleMapToPreImported) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return nodeModuleMapToPreImported[module];
      }

      // eslint-disable-next-line @typescript-eslint/no-var-requires
      return require(`${module}`) as unknown;
      // this stupid string templating was necessary to not have
      // webpack warnings like:
      //
      // Import trace for requested module:
      // ./src/utils/get-email-component.tsx
      // ./src/app/page.tsx
      //  ⚠ ./src/utils/get-email-component.tsx
      // Critical dependency: the request of a dependency is an expression
    },
    process,
  };
  try {
    vm.runInNewContext(builtEmailCode, fakeContext, { filename: emailPath });
  } catch (exception) {
    const error = exception as Error;
    let stack: string | undefined;

    if (typeof error.stack !== 'undefined') {
      const parsedStack = stackTraceParser.parse(error.stack);
      const sourceMapConsumer = new SourceMapConsumer(
        JSON.parse(sourceMapFile.text) as RawSourceMap,
      );
      const newStackLines = [] as string[];
      for (const stackFrame of parsedStack) {
        if (stackFrame.file === emailPath) {
          if (stackFrame.column || stackFrame.lineNumber) {
            const positionWithError = sourceMapConsumer.originalPositionFor({
              column: stackFrame.column ?? 0,
              line: stackFrame.lineNumber ?? 0,
            });
            const columnAndLine =
              positionWithError.column && positionWithError.line
                ? `${positionWithError.line}:${positionWithError.column}`
                : positionWithError.line;
            newStackLines.push(
              ` at ${stackFrame.methodName} (${emailPath}:${columnAndLine})`,
            );
          } else {
            newStackLines.push(` at ${stackFrame.methodName} (${emailPath})`);
          }
        } else {
          const columnAndLine =
            stackFrame.column && stackFrame.lineNumber
              ? `${stackFrame.lineNumber}:${stackFrame.column}`
              : stackFrame.lineNumber;
          newStackLines.push(
            ` at ${stackFrame.methodName} (${stackFrame.file}:${columnAndLine})`,
          );
        }
      }
      stack = newStackLines.join('\n');
    }

    return {
      error: {
        name: error.name,
        message: error.message,
        cause: error.cause,
        stack,
      },
    };
  }

  return {
    emailComponent: fakeContext.module.exports.default as EmailComponent,
  };
};
