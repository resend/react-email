import fs, { unlinkSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { glob } from 'glob';
import esbuild from 'esbuild';
import { createElement } from 'react';
import logSymbols from 'log-symbols';
import type { Options } from '@react-email/render';
import { render } from '@react-email/render';
import normalize from 'normalize-path';
import shell from 'shelljs';
import { tree } from '../utils/tree';
import { OurSpinner } from '../utils/our-spinner';

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
  let spinner = new OurSpinner('Preparing files...');
  spinner.start();

  const allTemplates = glob.sync(normalize(path.join(srcDir, '*.{tsx,jsx}')));

  const buildResult = esbuild.buildSync({
    bundle: true,
    entryPoints: allTemplates,
    platform: 'node',
    write: true,
    tsconfig: path.resolve(__dirname, '../../tsconfig.export.json'),
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
  spinner.stopAndPersist({
    symbol: logSymbols.success,
    text: 'Preparing files...\n',
  });

  const allBuiltTemplates = glob.sync(normalize(`${outDir}/*.js`), {
    absolute: true,
  });

  spinner = new OurSpinner(undefined);
  for await (const [i, template] of Object.entries(
    allBuiltTemplates,
  ) as unknown as [number, string][]) {
    try {
      spinner.setSpinnerTitle(
        `rendering ${template.split('/').pop()} (${i}/${
          allBuiltTemplates.length
        })`,
      );
      spinner.start();

      const emailTemplate = (await import(template)) as {
        default: React.FC<Record<string, never>>;
      };
      const rendered = render(
        emailTemplate.default({}) as React.ReactElement,
        options,
      );
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
  spinner.succeed(
    `Successfully rendered ${allBuiltTemplates.length} email templates\n`,
  );

  spinner = new OurSpinner('Copying static files');
  spinner.start();

  const staticDir = path.join(srcDir, 'static');
  const hasStaticDirectory = fs.existsSync(staticDir);

  if (hasStaticDirectory) {
    const outStaticPath = path.join(outDir, 'static');
    shell.rm('-rf', outStaticPath);
    const result = shell.cp('-r', staticDir, outStaticPath);
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
  spinner.succeed('Copying static files\n');

  const fileTree = await tree(outDir, 4);

  console.log(fileTree);

  spinner.stopAndPersist({
    symbol: logSymbols.success,
    text: 'Successfully exported emails',
  });

  process.exit();
};
