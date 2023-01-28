import { glob } from 'glob';
import esbuild from 'esbuild';
import tree from 'tree-node-cli';
import ora from 'ora';
import logSymbols from 'log-symbols';
import { render, Options } from '@react-email/render';
import { unlinkSync, writeFileSync } from 'fs';
import copy from 'cpy';
import normalize from 'normalize-path';
import { checkDirectoryExist } from '../utils';
import path from 'path';
/*
  This first builds all the templates using esbuild and then puts the output in the `.js`
  files. Then these `.js` files are imported dynamically and rendered to `.html` files
  using the `render` function.
 */
export const exportTemplates = async (outDir: string, srcDir: string, options: Options) => {
  const spinner = ora('Preparing files...\n').start();
  const allTemplates = glob.sync(
    normalize(path.join(srcDir, '*.{tsx,jsx}')),
  );

  esbuild.buildSync({
    bundle: true,
    entryPoints: allTemplates,
    platform: 'node',
    write: true,
    outdir: outDir,
  });

  const allBuiltTemplates = glob.sync(normalize(`${outDir}/*.js`), {
    absolute: true,
  });

  for (const template of allBuiltTemplates) {
    const component = await import(template);
    const rendered = render(component.default(), options);
    const htmlPath = template.replace(
      '.js',
      options.plainText ? '.txt' : '.html',
    );
    writeFileSync(htmlPath, rendered);
    unlinkSync(template);
  }

  const staticDir = path.join(srcDir, 'static')
  const hasStaticDirectory = checkDirectoryExist(
    staticDir
  );

  if (hasStaticDirectory) {
    await copy(staticDir, `${outDir}/static`);
  }

  const fileTree = tree(outDir, {
    allFiles: true,
    maxDepth: 4,
  });

  console.log(fileTree);

  spinner.stopAndPersist({
    symbol: logSymbols.success,
    text: 'Successfully exported emails',
  });

  process.exit();
};
