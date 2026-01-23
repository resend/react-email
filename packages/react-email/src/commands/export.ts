import fs, { unlinkSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import url from 'node:url';
import type { Options } from '@react-email/components';
import { type BuildFailure, build } from 'esbuild';
import { glob } from 'glob';
import logSymbols from 'log-symbols';
import normalize from 'normalize-path';
import ora, { type Ora } from 'ora';
import type React from 'react';
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

/**
 * Splits an array into chunks of specified size
 */
const chunkArray = <T>(array: T[], chunkSize: number): T[][] => {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
};

/**
 * Number of templates to process in each chunk to avoid memory issues
 */
const TEMPLATE_CHUNK_SIZE = 50;

type ExportTemplatesOptions = Options & {
  silent?: boolean;
  pretty?: boolean;
};

const filename = url.fileURLToPath(import.meta.url);

const require = createRequire(filename);

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
  const templateChunks = chunkArray(allTemplates, TEMPLATE_CHUNK_SIZE);
  const totalChunks = templateChunks.length;

  // Track existing built files to identify newly created ones after each chunk build
  let existingBuiltFiles = new Set<string>();

  // Process templates in chunks to avoid memory issues
  for (const [chunkIndex, chunk] of templateChunks.entries()) {
    const chunkNumber = chunkIndex + 1;

    if (spinner) {
      spinner.text = `Building chunk ${chunkNumber}/${totalChunks} (${chunk.length} templates)...`;
      spinner.render();
    }

    try {
      await build({
        bundle: true,
        entryPoints: chunk,
        format: 'cjs',
        jsx: 'automatic',
        loader: { '.js': 'jsx' },
        logLevel: 'silent',
        outExtension: { '.js': '.cjs' },
        outdir: pathToWhereEmailMarkupShouldBeDumped,
        platform: 'node',
        plugins: [renderingUtilitiesExporter(chunk)],
        write: true,
      });
    } catch (exception) {
      if (spinner) {
        spinner.stopAndPersist({
          symbol: logSymbols.error,
          text: `Failed to build emails (chunk ${chunkNumber}/${totalChunks})`,
        });
      }

      const buildFailure = exception as BuildFailure;
      console.error(`\n${buildFailure.message}`);

      process.exit(1);
    }

    // Get all built templates after this chunk's build
    const allBuiltTemplates = glob.sync(
      normalize(`${pathToWhereEmailMarkupShouldBeDumped}/**/*.cjs`),
      {
        absolute: true,
      },
    );

    // Find newly created files from this chunk (not in existingBuiltFiles)
    const newChunkTemplates = allBuiltTemplates.filter(
      (template) => !existingBuiltFiles.has(normalize(template)),
    );

    // Update the set of existing files for the next iteration
    existingBuiltFiles = new Set(
      allBuiltTemplates.map((template) => normalize(template)),
    );

    // Render templates from this chunk immediately after building
    // This helps free up memory before processing the next chunk
    for (const template of newChunkTemplates) {
      try {
        if (spinner) {
          spinner.text = `Rendering ${template.split('/').pop()} (chunk ${chunkNumber}/${totalChunks})...`;
          spinner.render();
        }
        delete require.cache[template];
        const emailModule = require(template) as {
          default: React.FC;
          render: (
            element: React.ReactElement,
            options: Record<string, unknown>,
          ) => Promise<string>;
          reactEmailCreateReactElement: typeof React.createElement;
        };
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
      } catch (exception) {
        if (spinner) {
          spinner.stopAndPersist({
            symbol: logSymbols.error,
            text: `failed when rendering ${template.split('/').pop()}`,
          });
        }
        console.error(exception);
        process.exit(1);
      }
    }
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
