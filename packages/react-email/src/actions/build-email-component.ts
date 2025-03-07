'use server';
import fs from 'node:fs';
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import path from 'node:path';
import vm from 'node:vm';
import type { render } from '@react-email/render';
import { type BuildFailure, type OutputFile, build } from 'esbuild';
import type React from 'react';
import type { RawSourceMap } from 'source-map-js';
import { renderingUtilitiesExporter } from '../utils/esbuild/renderring-utilities-exporter';
import { staticNodeModulesForVM } from '../utils/static-node-modules-for-vm';
import type { EmailTemplate as EmailComponent } from '../utils/types/email-template';
import { err, isErr, ok, type Result } from '../utils/result';
import { resolvePathFromSlug } from './resolve-path-from-slug';
import type { ErrorObject } from '../utils/types/error-object';
import { improveErrorWithSourceMap } from '../utils/improve-error-with-sourcemap';

const buildEmailIntoRunnableCode = async (
  emailPath: string,
): Promise<
  Result<{ runnableCode: string; sourceMap: RawSourceMap }, ErrorObject>
> => {
  let outputFiles: OutputFile[];
  try {
    const buildData = await build({
      bundle: true,
      entryPoints: [emailPath],
      plugins: [renderingUtilitiesExporter([emailPath])],
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
    return err({
      name: buildFailure.name,
      message: buildFailure.message,
      stack: buildFailure.stack,
      cause: buildFailure.cause,
    });
  }

  const sourceMapFile = outputFiles[0]!;
  const bundledEmailFile = outputFiles[1]!;

  const builtEmailCode = bundledEmailFile.text;

  const sourceMapText = sourceMapFile.text;
  const sourceMapPath = sourceMapFile.path;

  const sourceMapToEmail = JSON.parse(sourceMapText) as RawSourceMap;
  // because it will have a path like <tsconfigLocation>/stdout/email.js.map
  sourceMapToEmail.sourceRoot = path.resolve(sourceMapPath, '../..');
  sourceMapToEmail.sources = sourceMapToEmail.sources.map((source) =>
    path.resolve(sourceMapPath, '..', source),
  );

  return ok({
    runnableCode: builtEmailCode,
    sourceMap: sourceMapToEmail,
  });
};

export interface EmailComponentMetadata {
  fileContents: string;
  emailPath: string;

  emailComponent: EmailComponent;
  createElement: typeof React.createElement;
  render: typeof render;
  sourceMap: RawSourceMap;
}

const emailComponents = new Map<string, EmailComponentMetadata>();

type BuildEmailComponentError =
  | { type: 'FAILED_TO_RESOLVE_PATH' }
  | {
    type: 'BUILD_FAILED';
    failure: ErrorObject;
  }
  | {
    type: 'COMPONENT_EVALUATION_ERROR';
    error: ErrorObject;
  }
  | {
    type: 'NO_DEFAULT_EXPORT';
    error: ErrorObject;
  };

export type BuildEmailComponentResult = Result<void, BuildEmailComponentError>;

export const buildEmailComponent = async (
  emailSlug: string,
): Promise<BuildEmailComponentResult> => {
  const resolutionResult = await resolvePathFromSlug(emailSlug);

  if (isErr(resolutionResult)) {
    return err({ type: 'FAILED_TO_RESOLVE_PATH' });
  }

  const emailPath = resolutionResult.value;

  const buildResult = await buildEmailIntoRunnableCode(emailPath);
  if (isErr(buildResult)) {
    return err({ type: 'BUILD_FAILED', failure: buildResult.error });
  }

  const { runnableCode, sourceMap } = buildResult.value;

  const fakeContext = {
    ...global,
    console,
    Buffer,
    AbortSignal,
    Event,
    EventTarget,
    TextDecoder,
    Request,
    Response,
    TextDecoderStream,
    TextEncoder,
    TextEncoderStream,
    ReadableStream,
    URL,
    URLSearchParams,
    Headers,
    module: {
      exports: {
        default: undefined as unknown,
        render: undefined as unknown,
        reactEmailCreateReactElement: undefined as unknown,
      },
    },
    __filename: emailPath,
    __dirname: path.dirname(emailPath),
    require: (specifiedModule: string) => {
      let m = specifiedModule;
      if (specifiedModule.startsWith('node:')) {
        m = m.split(':')[1]!;
      }

      if (m in staticNodeModulesForVM) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return staticNodeModulesForVM[m];
      }

      // eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-useless-template-literals
      return require(`${specifiedModule}`) as unknown;
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
    vm.runInNewContext(runnableCode, fakeContext, { filename: emailPath });
  } catch (exception) {
    return err({
      type: 'COMPONENT_EVALUATION_ERROR',
      error: improveErrorWithSourceMap(
        exception as Error,
        emailPath,
        sourceMap,
      ),
    });
  }

  if (fakeContext.module.exports.default === undefined) {
    return err({
      type: 'NO_DEFAULT_EXPORT',
      error: improveErrorWithSourceMap(
        new Error(`Email component missing default export (${emailSlug})`),
        emailPath,
        sourceMap,
      ),
    });
  }

  const fileContents = await fs.promises.readFile(emailPath, 'utf-8');

  emailComponents.set(emailSlug, {
    emailPath,
    fileContents,

    emailComponent: fakeContext.module.exports.default as EmailComponent,
    sourceMap,
    createElement: fakeContext.module.exports
      .reactEmailCreateReactElement as typeof React.createElement,
    render: fakeContext.module.exports.render as typeof render,
  });

  return ok();
};

export const getEmailComponent = async (emailSlug: string) => {
  return emailComponents.get(emailSlug);
};
