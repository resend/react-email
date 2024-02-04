import fs, { unlinkSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { glob } from 'glob';
import { buildSync } from 'esbuild';
import ora from 'ora';
import logSymbols from 'log-symbols';
import type { Options } from '@react-email/render';
import { render } from '@react-email/render';
import normalize from 'normalize-path';
import { cp } from 'shelljs';
import { closeOraOnSIGNIT } from '../utils/close-ora-on-sigint';
import { tree } from '../utils';
import {
  EmailsDirectory,
  getEmailsDirectoryMetadata,
} from '../../actions/get-emails-directory-metadata';

const getEmailTemplatesFromDirectory = (emailDirectory: EmailsDirectory) => {
  const templatePaths = [] as string[];
  emailDirectory.emailFilenames.forEach((filename) =>
    templatePaths.push(path.join(emailDirectory.absolutePath, filename)),
  );
  emailDirectory.subDirectories.forEach((directory) => {
    templatePaths.push(...getEmailTemplatesFromDirectory(directory));
  });

  return templatePaths;
};

/*
  This first builds all the templates using esbuild and then puts the output in the `.js`
  files. Then these `.js` files are imported dynamically and rendered to `.html` files
  using the `render` function.
 */
export const exportTemplates = async (
  pathToWhereEmailMarkupShouldBeDumped: string,
  emailsDirectoryPath: string,
  options: Options,
) => {
  const spinner = ora('Preparing files...\n').start();
  closeOraOnSIGNIT(spinner);

  const emailsDirectoryMetadata = await getEmailsDirectoryMetadata(
    path.join(process.cwd(), emailsDirectoryPath),
  );

  if (typeof emailsDirectoryMetadata === 'undefined') {
    spinner.stopAndPersist({
      symbol: logSymbols.error,
      text: `Could not find the directory at ${emailsDirectoryPath}`,
    });
    return;
  }

  const allTemplates = getEmailTemplatesFromDirectory(emailsDirectoryMetadata);

  const buildResult = buildSync({
    bundle: true,
    entryPoints: allTemplates,
    platform: 'node',
    format: 'cjs',
    jsx: 'transform',
    write: true,
    outdir: pathToWhereEmailMarkupShouldBeDumped,
  });
  if (buildResult.warnings.length > 0) {
    console.warn(buildResult.warnings);
  }
  if (buildResult.errors.length > 0) {
    spinner.stopAndPersist({
      symbol: logSymbols.error,
      text: 'Failed to build emails',
    });
    console.error(buildResult.errors);
    throw new Error(
      `esbuild bundling process for email templates:\n${allTemplates
        .map((p) => `- ${p}`)
        .join('\n')}`,
    );
  }
  spinner.succeed();

  const allBuiltTemplates = glob.sync(
    normalize(`${pathToWhereEmailMarkupShouldBeDumped}/*.js`),
    {
      absolute: true,
    },
  );

  for (const template of allBuiltTemplates) {
    try {
      spinner.text = `rendering ${template.split('/').pop()}`;
      spinner.render();
      delete require.cache[template];
      const component = require(template);
      const rendered = render(component.default({}), options);
      const htmlPath = template.replace(
        '.js',
        options.plainText ? '.txt' : '.html',
      );
      writeFileSync(htmlPath, rendered);
      unlinkSync(template);
    } catch (exception) {
      spinner.stopAndPersist({
        symbol: logSymbols.error,
        text: `failed when rendering ${template.split('/').pop()}`,
      });
      console.error(exception);
      throw exception;
    }
  }
  spinner.succeed('Rendered all files');
  spinner.text = `Copying static files`;
  spinner.render();

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

    const result = cp(
      '-r',
      staticDirectoryPath,
      path.join(pathToWhereEmailMarkupShouldBeDumped, 'static'),
    );
    if (result.code > 0) {
      spinner.stopAndPersist({
        symbol: logSymbols.error,
        text: 'Failed to copy static files',
      });
      throw new Error(
        `Something went wrong while copying the file to ${pathToWhereEmailMarkupShouldBeDumped}/static, ${result.stderr}`,
      );
    }
  }
  spinner.succeed();

  const fileTree = await tree(pathToWhereEmailMarkupShouldBeDumped, 4);

  console.log(fileTree);

  spinner.stopAndPersist({
    symbol: logSymbols.success,
    text: 'Successfully exported emails',
  });

  process.exit();
};
