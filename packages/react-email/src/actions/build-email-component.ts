'use server';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import type { render } from '@react-email/render';
import type React from 'react';
import type { RawSourceMap } from 'source-map-js';
import { emailsDirectoryAbsolutePath, isBuilding } from '../app/env';
import { buildEmailIntoRunnableCode } from '../utils/build-email-into-runnable-code';
import { improveErrorWithSourceMap } from '../utils/improve-error-with-sourcemap';
import { resolveFileFromImportPath } from '../utils/resolve-file-from-import-path';
import { type Result, err, isErr, ok } from '../utils/result';
import { staticNodeModulesForVM } from '../utils/static-node-modules-for-vm';
import type { EmailTemplate as EmailComponent } from '../utils/types/email-template';
import type { ErrorObject } from '../utils/types/error-object';
import { predoneBuildDataJson } from './predone-build-data';

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

const predoneBuildData: Record<
  string,
  {
    emailPath: string;
    sourceMap: RawSourceMap;
    runnableCode: string;
    fileContents: string;
  }
> = JSON.parse(predoneBuildDataJson);

export const buildEmailComponent = async (
  emailSlug: string,
): Promise<BuildEmailComponentResult> => {
  let runnableCode: string;
  let sourceMap: RawSourceMap;
  let emailPath: string;
  let fileContents: string;
  if (!isBuilding) {
    console.log(emailsDirectoryAbsolutePath);
    const resolutionResult = await resolveFileFromImportPath(
      path.join(emailsDirectoryAbsolutePath, emailSlug),
    );

    if (isErr(resolutionResult)) {
      return err({ type: 'FAILED_TO_RESOLVE_PATH' });
    }

    emailPath = resolutionResult.value;

    const buildResult = await buildEmailIntoRunnableCode(emailPath);
    if (isErr(buildResult)) {
      return err({ type: 'BUILD_FAILED', failure: buildResult.error });
    }
    ({ runnableCode, sourceMap } = buildResult.value);
    fileContents = await fs.promises.readFile(emailPath, 'utf-8');
  } else {
    if (predoneBuildData[emailSlug]) {
      ({ emailPath, sourceMap, runnableCode, fileContents } =
        predoneBuildData[emailSlug]);
    } else {
      return err({ type: 'FAILED_TO_RESOLVE_PATH' });
    }
  }

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
