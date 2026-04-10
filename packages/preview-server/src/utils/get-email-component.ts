import path from 'node:path';
import type { render } from 'react-email';
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

function describeBundledModuleExports(value: unknown): string {
  if (value === null || value === undefined) {
    return `module value is ${String(value)}`;
  }
  if (typeof value !== 'object') {
    return `module value has typeof ${typeof value}`;
  }
  const record = value as Record<string, unknown>;
  const keys = Object.keys(record);
  if (keys.length === 0) {
    return 'module value is an object with no own enumerable keys';
  }
  const keyTypes = keys
    .map((key) => `${JSON.stringify(key)}: ${typeof record[key]}`)
    .join(', ');
  return `Object.keys: [${keys.map((k) => JSON.stringify(k)).join(', ')}]; ${keyTypes}`;
}

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

      format: 'esm',
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
  // Because it will have a path like `<tsconfigLocation>/stdout/email.js`
  sourceMapToEmail.sourceRoot = path.resolve(sourceMapFile.path, '../..');
  sourceMapToEmail.sources = sourceMapToEmail.sources.map((source) =>
    path.resolve(sourceMapFile.path, '..', source),
  );

  const context = createContext(emailPath, {
    shouldIncludeSourceReference: false,
  });
  const runningResult = await runBundledCode(
    builtEmailCode,
    emailPath,
    context,
  );

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

    console.error(error);
    return {
      error: {
        name: 'Error',
        message: `Unknown error occurred while running the email component at ${emailPath}`,
        stack: new Error().stack,
        cause: error,
      },
    };
  }

  const parseResult = EmailComponentModule.safeParse(runningResult.value);

  if (parseResult.error) {
    const zodIssueSummary = parseResult.error.issues
      .map(
        (issue) =>
          `${issue.path.length ? issue.path.join('.') : '(root)'}: ${issue.message} (${issue.code})`,
      )
      .join('; ');
    const actualExports = describeBundledModuleExports(runningResult.value);
    return {
      error: {
        name: 'Error',
        message: `The email component at ${emailPath} does not contain the expected exports. Zod: ${zodIssueSummary}. Actual: ${actualExports}`,
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

  const typedRender = componentModule.render as typeof render;

  return {
    emailComponent: componentModule.default as EmailComponent,
    renderWithReferences: (async (...args: Parameters<typeof render>) => {
      context.shouldIncludeSourceReference = true;
      const renderingResult = await typedRender(...args);
      context.shouldIncludeSourceReference = false;
      return renderingResult;
    }) as typeof render,
    render: typedRender,
    createElement:
      componentModule.reactEmailCreateReactElement as typeof React.createElement,

    sourceMapToOriginalFile: sourceMapToEmail,
  };
};
