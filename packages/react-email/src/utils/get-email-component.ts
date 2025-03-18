import path from 'node:path';
import fs from 'node:fs/promises';
import vm from 'node:vm';
import type { render } from '@react-email/render';
import { type BuildFailure, type OutputFile, build } from 'esbuild';
import type React from 'react';
import type { RawSourceMap } from 'source-map-js';
import { z } from 'zod';
import { renderingUtilitiesExporter } from './esbuild/renderring-utilities-exporter';
import { improveErrorWithSourceMap } from './improve-error-with-sourcemap';
import { isErr } from './result';
import { runBundledCode } from './run-bundled-code';
import type { EmailTemplate as EmailComponent } from './types/email-template';
import type { ErrorObject } from './types/error-object';

const EmailComponentModule = z.object({
  default: z.any(),
  render: z.function(),
  reactEmailCreateReactElement: z.function(),
});

export const addSourceHintsToJSX = (code: string, path: string) => {
  let linesToProcess = code.split(/\n|\r|\r\n/);
  const totalLineCount = linesToProcess.length;
  return code.replaceAll(/<([^\/].+?)\/?\s*>/gm, (match, tagStartContents) => {
    const matchLines = match.split(/\n|\r|\r\n/);
    const startLineIndex = linesToProcess.findIndex((line) =>
      line.includes(matchLines[0]!),
    );
    const endLineIndex =
      matchLines.length === 1
        ? startLineIndex
        : linesToProcess.findIndex((line) =>
          line.includes(matchLines[matchLines.length - 1]!),
        );

    const startColumnIndex = linesToProcess[startLineIndex]!.indexOf(matchLines[0]!);
    const startLine =
      startLineIndex + 1 + totalLineCount - linesToProcess.length;

    linesToProcess = linesToProcess.slice(endLineIndex + 1);
    return `<${tagStartContents} data-preview-file="${path}" data-preview-line="${startLine}" data-preview-column="${startColumnIndex + 1}">`;
  });
};

export const getEmailComponent = async (
  emailPath: string,
): Promise<
  | {
    emailComponent: EmailComponent;

    createElement: typeof React.createElement;

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
      plugins: [
        renderingUtilitiesExporter([emailPath]),
        {
          name: 'testing',
          setup(b) {
            b.onLoad(
              { filter: /[^/]\.(tsx|jsx|js|cjs|mjs)$/ },
              async ({ path }) => {
                // console.log(path);
                const file = await fs.readFile(path, 'utf8');
                return {
                  contents: addSourceHintsToJSX(file, path),
                };
              },
            );
          },
        },
      ],
      platform: 'node',
      write: false,

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

  const runningResult = runBundledCode(builtEmailCode, emailPath);

  if (isErr(runningResult)) {
    const { error } = runningResult;
    if (error instanceof Error) {
      error.stack &&= error.stack.split('at Script.runInContext (node:vm')[0];

      return {
        error: improveErrorWithSourceMap(error, emailPath, sourceMapToEmail),
      };
    }

    throw error;
  }

  const parseResult = EmailComponentModule.safeParse(runningResult.value);

  if (parseResult.error) {
    return {
      error: improveErrorWithSourceMap(
        new Error(
          `The email component at ${emailPath} does not contain the expected exports`,
          {
            cause: parseResult.error,
          },
        ),
        emailPath,
        sourceMapToEmail,
      ),
    };
  }

  const { data: componentModule } = parseResult;

  return {
    emailComponent: componentModule.default as EmailComponent,
    render: componentModule.render as typeof render,
    createElement:
      componentModule.reactEmailCreateReactElement as typeof React.createElement,

    sourceMapToOriginalFile: sourceMapToEmail,
  };
};
