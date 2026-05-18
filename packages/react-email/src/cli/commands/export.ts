import fs from 'node:fs';
import path from 'node:path';
import { Worker } from 'node:worker_threads';
import type { Options } from '@react-email/render';
import { type BuildFailure, build, stop } from 'esbuild';
import { glob } from 'glob';
import logSymbols from 'log-symbols';
import normalize from 'normalize-path';
import { renderingUtilitiesExporter } from '../utils/esbuild/renderring-utilities-exporter.js';
import {
  type EmailsDirectory,
  getEmailsDirectoryMetadata,
} from '../utils/get-emails-directory-metadata.js';
import { tree } from '../utils/index.js';
import { registerSpinnerAutostopping } from '../utils/register-spinner-autostopping.js';
import {
  createSpinner,
  type Spinner,
  stopSpinnerAndPersist,
} from '../utils/spinner.js';

const getEmailTemplatesFromDirectory = (emailDirectory: EmailsDirectory) => {
  const templatePaths = [] as string[];
  for (const filename of emailDirectory.emailFilenames) {
    templatePaths.push(path.join(emailDirectory.absolutePath, filename));
  }
  for (const directory of emailDirectory.subDirectories) {
    templatePaths.push(...getEmailTemplatesFromDirectory(directory));
  }

  return templatePaths;
};

type ExportTemplatesOptions = Options & {
  silent?: boolean;
  pretty?: boolean;
};

// esbuild bundles each entry's full dep graph in-memory, so building all
// templates in one call OOMs at high counts (#2887). Batching caps peak
// memory at BUILD_BATCH_SIZE × per-entry cost.
const BUILD_BATCH_SIZE = 10;

// Each bundled .cjs is ~1.5MB of self-contained code (inlined react-email,
// tailwind, css-tree, react). Requiring many in one process accumulates V8
// state that `delete require.cache[...]` cannot release. Renders run in
// worker_threads, RENDER_BATCH_SIZE templates per worker, so each batch's
// V8 isolate is reclaimed when the worker exits.
const RENDER_BATCH_SIZE = 25;

// Inlined as a string so we don't need a separate worker file (which would
// require path/extension juggling between dev source and bundled dist).
// CommonJS because `new Worker(code, { eval: true })` evaluates as CJS.
const renderWorkerSource = `
const { unlinkSync, writeFileSync } = require('node:fs');
const { parentPort, workerData } = require('node:worker_threads');

const { templates, options } = workerData;

(async () => {
  for (const template of templates) {
    try {
      const emailModule = require(template);
      const rendered = await emailModule.render(
        emailModule.reactEmailCreateReactElement(emailModule.default, {}),
        options,
      );
      const htmlPath = template.replace(
        '.cjs',
        options.plainText ? '.txt' : '.html',
      );
      writeFileSync(htmlPath, rendered);
      unlinkSync(template);
      parentPort.postMessage({ type: 'progress', template });
    } catch (exception) {
      parentPort.postMessage({
        type: 'error',
        template,
        message: exception && exception.stack ? exception.stack : String(exception),
      });
      process.exit(1);
    }
  }
})();
`;

type RenderWorkerMessage =
  | { type: 'progress'; template: string }
  | { type: 'error'; template: string; message: string };

/*
  This first builds all the templates using esbuild and then puts the output in the `.js`
  files. Then these `.js` files are imported dynamically and rendered to `.html` files
  using the `render` function.
 */
export const exportTemplates = async (
  pathToWhereEmailMarkupShouldBeDumped: string,
  emailsDirectoryPath: string,
  options: ExportTemplatesOptions,
) => {
  let spinner: Spinner | undefined;
  if (!options.silent) {
    spinner = createSpinner('Preparing files...\n');
    spinner.start();
    registerSpinnerAutostopping(spinner);
  }

  const emailsDirectoryMetadata = await getEmailsDirectoryMetadata(
    path.resolve(process.cwd(), emailsDirectoryPath),
    true,
  );

  if (typeof emailsDirectoryMetadata === 'undefined') {
    if (spinner) {
      stopSpinnerAndPersist(spinner, {
        symbol: logSymbols.error,
        text: `Could not find the directory at ${emailsDirectoryPath}`,
      });
    } else {
      console.error(`Could not find the directory at ${emailsDirectoryPath}`);
    }
    process.exit(1);
  }

  if (fs.existsSync(pathToWhereEmailMarkupShouldBeDumped)) {
    fs.rmSync(pathToWhereEmailMarkupShouldBeDumped, { recursive: true });
  }

  const allTemplates = getEmailTemplatesFromDirectory(emailsDirectoryMetadata);

  try {
    for (let i = 0; i < allTemplates.length; i += BUILD_BATCH_SIZE) {
      const batch = allTemplates.slice(i, i + BUILD_BATCH_SIZE);
      await build({
        bundle: true,
        entryPoints: batch,
        external: ['css-tree'],
        format: 'cjs',
        jsx: 'automatic',
        loader: { '.js': 'jsx' },
        logLevel: 'silent',
        outExtension: { '.js': '.cjs' },
        outdir: pathToWhereEmailMarkupShouldBeDumped,
        platform: 'node',
        plugins: [renderingUtilitiesExporter(batch)],
        write: true,
      });
      // Kill the esbuild service between batches so Go releases its RSS;
      // the next build() spawns a fresh process.
      await stop();
    }
  } catch (exception) {
    if (spinner) {
      stopSpinnerAndPersist(spinner, {
        symbol: logSymbols.error,
        text: 'Failed to build emails',
      });
    }

    const buildFailure = exception as BuildFailure;
    console.error(`\n${buildFailure.message}`);

    process.exit(1);
  }

  if (spinner) {
    spinner.succeed();
  }

  const allBuiltTemplates = glob.sync(
    normalize(`${pathToWhereEmailMarkupShouldBeDumped}/**/*.cjs`),
    {
      absolute: true,
    },
  );

  if (spinner && allBuiltTemplates.length > 0) {
    spinner.setText(`rendering ${allBuiltTemplates[0]?.split('/').pop()}`);
    spinner.start();
  }

  for (let i = 0; i < allBuiltTemplates.length; i += RENDER_BATCH_SIZE) {
    const batch = allBuiltTemplates.slice(i, i + RENDER_BATCH_SIZE);
    let failedTemplate: string | undefined;
    let failureMessage: string | undefined;

    try {
      await new Promise<void>((resolve, reject) => {
        const worker = new Worker(renderWorkerSource, {
          eval: true,
          workerData: { templates: batch, options },
          execArgv: process.execArgv,
        });
        worker.on('message', (msg: RenderWorkerMessage) => {
          if (msg.type === 'progress') {
            if (spinner) {
              spinner.setText(`rendering ${msg.template.split('/').pop()}`);
            }
          } else if (msg.type === 'error') {
            failedTemplate = msg.template;
            failureMessage = msg.message;
          }
        });
        worker.on('error', reject);
        worker.on('exit', (code) => {
          if (code !== 0) {
            reject(
              new Error(
                failureMessage ?? `Render worker exited with code ${code}`,
              ),
            );
          } else {
            resolve();
          }
        });
      });
    } catch (exception) {
      if (spinner) {
        stopSpinnerAndPersist(spinner, {
          symbol: logSymbols.error,
          text: failedTemplate
            ? `failed when rendering ${failedTemplate.split('/').pop()}`
            : 'failed when rendering',
        });
      }
      console.error(exception);
      process.exit(1);
    }
  }
  if (spinner) {
    spinner.succeed('Rendered all files');
    spinner.setText('Copying static files');
    spinner.start();
  }

  // ex: emails/static
  const staticDirectoryPath = path.join(emailsDirectoryPath, 'static');

  if (fs.existsSync(staticDirectoryPath)) {
    const pathToDumpStaticFilesInto = path.join(
      pathToWhereEmailMarkupShouldBeDumped,
      'static',
    );
    // cp('-r', ...) will copy *inside* of the static directory if it exists
    // causing a duplication of static files, so we need to delete ir first
    if (fs.existsSync(pathToDumpStaticFilesInto))
      await fs.promises.rm(pathToDumpStaticFilesInto, { recursive: true });

    try {
      await fs.promises.cp(staticDirectoryPath, pathToDumpStaticFilesInto, {
        recursive: true,
      });
    } catch (exception) {
      console.error(exception);
      if (spinner) {
        stopSpinnerAndPersist(spinner, {
          symbol: logSymbols.error,
          text: 'Failed to copy static files',
        });
      }
      console.error(
        `Something went wrong while copying the file to ${pathToWhereEmailMarkupShouldBeDumped}/static, ${exception}`,
      );
      process.exit(1);
    }
  }

  if (spinner && !options.silent) {
    spinner.succeed();

    const fileTree = await tree(pathToWhereEmailMarkupShouldBeDumped, 4);

    console.log(fileTree);
    console.log(`${logSymbols.success} Successfully exported emails`);
  }
};
