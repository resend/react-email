import fs from 'node:fs';
import { spawn } from 'node:child_process';
import path from 'node:path';
import url from 'node:url';
import type { Options } from '@react-email/components';
import { type BuildFailure, build } from 'esbuild';
import { glob } from 'glob';
import logSymbols from 'log-symbols';
import normalize from 'normalize-path';
import ora, { type Ora } from 'ora';
import { renderingUtilitiesExporter } from '../utils/esbuild/renderring-utilities-exporter.js';
import {
  type EmailsDirectory,
  getEmailsDirectoryMetadata,
} from '../utils/get-emails-directory-metadata.js';
import { tree } from '../utils/index.js';
import { registerSpinnerAutostopping } from '../utils/register-spinner-autostopping.js';

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

const filename = url.fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

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
  /* Delete the out directory if it already exists */
  if (fs.existsSync(pathToWhereEmailMarkupShouldBeDumped)) {
    fs.rmSync(pathToWhereEmailMarkupShouldBeDumped, { recursive: true });
  }

  let spinner: Ora | undefined;
  if (!options.silent) {
    spinner = ora('Preparing files...\n').start();
    registerSpinnerAutostopping(spinner);
  }

  const emailsDirectoryMetadata = await getEmailsDirectoryMetadata(
    path.resolve(process.cwd(), emailsDirectoryPath),
    true,
  );

  if (typeof emailsDirectoryMetadata === 'undefined') {
    if (spinner) {
      spinner.stopAndPersist({
        symbol: logSymbols.error,
        text: `Could not find the directory at ${emailsDirectoryPath}`,
      });
    }
    return;
  }

  const allTemplates = getEmailTemplatesFromDirectory(emailsDirectoryMetadata);

  try {
    await build({
      bundle: true,
      entryPoints: allTemplates,
      format: 'cjs',
      jsx: 'automatic',
      loader: { '.js': 'jsx' },
      logLevel: 'silent',
      outExtension: { '.js': '.cjs' },
      outdir: pathToWhereEmailMarkupShouldBeDumped,
      platform: 'node',
      plugins: [renderingUtilitiesExporter(allTemplates)],
      write: true,
    });
  } catch (exception) {
    if (spinner) {
      spinner.stopAndPersist({
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

  // Render templates in separate processes to avoid memory issues
  // The worker script is compiled to dist/commands/export-worker.js
  const workerScriptPath = path.join(dirname, 'export-worker.js');
  const totalTemplates = allBuiltTemplates.length;

  for (let i = 0; i < allBuiltTemplates.length; i++) {
    const template = allBuiltTemplates[i];
    if (!template) continue;

    const templateName = template.split('/').pop() || 'unknown';

    if (spinner) {
      spinner.text = `Rendering ${templateName} (${i + 1}/${totalTemplates})...`;
      spinner.render();
    }

    const htmlPath = template.replace(
      '.cjs',
      options.plainText ? '.txt' : '.html',
    );

    const workerInput = {
      templatePath: template,
      htmlPath,
      options,
    };

    await new Promise<void>((resolve, reject) => {
      // Spawn worker process using the compiled JavaScript file
      const worker = spawn(process.execPath, [workerScriptPath, JSON.stringify(workerInput)], {
        cwd: process.cwd(),
        stdio: ['ignore', 'pipe', 'pipe'],
      });

      let stdout = '';
      let stderr = '';

      worker.stdout?.on('data', (data) => {
        stdout += data.toString();
      });

      worker.stderr?.on('data', (data) => {
        stderr += data.toString();
      });

      worker.on('close', (code) => {
        if (code === 0) {
          // Try to parse success message
          try {
            const lines = stdout.trim().split('\n');
            const lastLine = lines[lines.length - 1];
            if (lastLine) {
              const result = JSON.parse(lastLine);
              if (result.success) {
                resolve();
                return;
              }
            }
          } catch {
            // If parsing fails but exit code is 0, assume success
            resolve();
            return;
          }
          resolve();
        } else {
          // Try to parse error message
          let errorMessage = `Worker process exited with code ${code}`;
          try {
            const lines = stderr.trim().split('\n');
            const lastLine = lines[lines.length - 1];
            if (lastLine) {
              const error = JSON.parse(lastLine);
              if (error.error) {
                errorMessage = error.error;
              }
            }
          } catch {
            // Use stderr as fallback
            if (stderr) {
              errorMessage = stderr;
            }
          }

          if (spinner) {
            spinner.stopAndPersist({
              symbol: logSymbols.error,
              text: `Failed when rendering ${templateName}`,
            });
          }
          console.error(errorMessage);
          reject(new Error(errorMessage));
        }
      });

      worker.on('error', (error) => {
        if (spinner) {
          spinner.stopAndPersist({
            symbol: logSymbols.error,
            text: `Failed to spawn worker for ${templateName}`,
          });
        }
        console.error(`Failed to spawn worker: ${error.message}`);
        reject(error);
      });
    });
  }
  if (spinner) {
    spinner.succeed('Rendered all files');
    spinner.text = 'Copying static files';
    spinner.render();
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
        spinner.stopAndPersist({
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

    spinner.stopAndPersist({
      symbol: logSymbols.success,
      text: 'Successfully exported emails',
    });
  }
};
