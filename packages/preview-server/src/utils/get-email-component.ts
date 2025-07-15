import path from 'node:path';
import type { render } from '@react-email/components';
import { type BuildFailure, build, type OutputFile } from 'esbuild';
import type React from 'react';
import type { RawSourceMap } from 'source-map-js';
import { z } from 'zod';
import { convertStackWithSourceMap } from './convert-stack-with-sourcemap';
import { renderingUtilitiesExporter } from './esbuild/renderring-utilities-exporter';
import { isErr } from './result';
import { createContext, runBundledCode } from './run-bundled-code';
import type { EmailTemplate as EmailComponent } from './types/email-template';
import type { ErrorObject } from './types/error-object';

const EmailComponentModule = z.object({
  default: z.any(),
  render: z.function(),
  reactEmailCreateReactElement: z.function(),
});

export const getEmailComponent = async (
  emailPath: string,
  jsxRuntimePath: string,
): Promise<
  | {
      emailComponent: EmailComponent;

      createElement: typeof React.createElement;

      /**
       * Renders the HTML with `data-source-file`/`data-source-line` attributes that should only be
       * used internally in the preview server and never shown to the user.
       */
      renderWithReferences: typeof render;
      render: typeof render;

      sourceMapToOriginalFile: RawSourceMap;
    }
  | { error: ErrorObject }
> => {
  let outputFiles: OutputFile[];
  try {
    const buildData = await build({
      bundle: true,
      entryPoints: [emailPath],
      plugins: [renderingUtilitiesExporter([emailPath])],
      platform: 'node',
      write: false,

      jsxDev: true,
      jsxImportSource: jsxRuntimePath,

      format: 'cjs',
      jsx: 'automatic',
      logLevel: 'silent',
      // allows for using jsx on a .js file
      loader: {
        '.js': 'jsx',
      },
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

  const sourceMapToEmail = JSON.parse(sourceMapFile.text) as RawSourceMap;
  // because it will have a path like <tsconfigLocation>/stdout/email.js.map
  sourceMapToEmail.sourceRoot = path.resolve(sourceMapFile.path, '../..');
  sourceMapToEmail.sources = sourceMapToEmail.sources.map((source) =>
    path.resolve(sourceMapFile.path, '..', source),
  );

  const context = createContext(emailPath);
  context.shouldIncludeSourceReference = false;
  const runningResult = runBundledCode(builtEmailCode, emailPath, context);

  if (isErr(runningResult)) {
    const { error } = runningResult;
    if (error instanceof Error) {
      error.stack &&= error.stack.split('at Script.runInContext (node:vm')[0];

      return {
        error: {
          name: error.name,
          message: error.message,
          stack: convertStackWithSourceMap(
            error.stack,
            emailPath,
            sourceMapToEmail,
          ),
          cause: error.cause,
        },
      };
    }

    throw error;
  }

  const parseResult = EmailComponentModule.safeParse(runningResult.value);

  if (parseResult.error) {
    return {
      error: {
        name: 'Error',
        message: `The email component at ${emailPath} does not contain the expected exports`,
        stack: new Error().stack,
        cause: parseResult.error,
      },
    };
  }

  if (typeof parseResult.data.default !== 'function') {
    return {
      error: {
        name: 'Error',
        message: `The email component at ${emailPath} does not contain a default exported function`,
        stack: new Error().stack,
        cause: parseResult.error,
      },
    };
  }

  const { data: componentModule } = parseResult;

  return {
    emailComponent: componentModule.default as EmailComponent,
    renderWithReferences: (async (...args) => {
      context.shouldIncludeSourceReference = true;
      const renderingResult = await componentModule.render(...args);
      context.shouldIncludeSourceReference = false;
      return renderingResult;
    }) as typeof render,
    render: componentModule.render as typeof render,
    createElement:
      componentModule.reactEmailCreateReactElement as typeof React.createElement,

    sourceMapToOriginalFile: sourceMapToEmail,
  };
};
