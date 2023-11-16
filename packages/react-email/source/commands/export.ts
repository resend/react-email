import fs, { unlinkSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { glob } from 'glob';
import esbuild from 'esbuild';
import ora from 'ora';
import logSymbols from 'log-symbols';
import type { Options } from '@react-email/render';
import { render } from '@react-email/render';
import normalize from 'normalize-path';
import shell from 'shelljs';
import { closeOraOnSIGNIT } from '../utils/close-ora-on-sigint';
import { tree } from '../utils/tree';
/*
  This first builds all the templates using esbuild and then puts the output in the `.js`
  files. Then these `.js` files are imported dynamically and rendered to `.html` files
  using the `render` function.
 */
export const exportTemplates = async (
  outDir: string,
  srcDir: string,
  options: Options,
) => {
  const spinner = ora('Preparing files...\n').start();
  closeOraOnSIGNIT(spinner);

  const allTemplates = glob.sync(normalize(path.join(srcDir, '*.{tsx,jsx}')));

  const buildResult = esbuild.buildSync({
    bundle: true,
    entryPoints: allTemplates,
    platform: 'node',
    write: true,
    tsconfig: path.join(__dirname, '../../..', 'tsconfig.export.json'),
    outdir: outDir,
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

  const allBuiltTemplates = glob.sync(normalize(`${outDir}/*.js`), {
    absolute: true,
  });

  for (const template of allBuiltTemplates) {
    try {
      spinner.text = `rendering ${template.split('/').pop()}`;
      spinner.render();
      // eslint-disable-next-line
      const component = await import(template);
      // eslint-disable-next-line
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

  const staticDir = path.join(srcDir, 'static');
  const hasStaticDirectory = fs.existsSync(staticDir);

  if (hasStaticDirectory) {
    const result = shell.cp('-r', staticDir, path.join(outDir, 'static'));
    if (result.code > 0) {
      spinner.stopAndPersist({
        symbol: logSymbols.error,
        text: 'Failed to copy static files',
      });
      throw new Error(
        `Something went wrong while copying the file to ${outDir}/static, ${result.cat()}`,
      );
    }
  }
  spinner.succeed();

  const fileTree = await tree(outDir, 4);

  console.log(fileTree);

  spinner.stopAndPersist({
    symbol: logSymbols.success,
    text: 'Successfully exported emails',
  });

  process.exit();
};
