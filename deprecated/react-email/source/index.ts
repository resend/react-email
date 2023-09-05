#!/usr/bin/env node
import { program } from '@commander-js/extra-typings';
import { dev } from './commands/dev';
import { buildPreview, startPreview } from './commands/preview';
import { exportTemplates } from './commands/export';
import { PACKAGE_NAME } from './utils/constants';
import packageJson from '../package.json';

program
  .name(PACKAGE_NAME)
  .description('A live preview of your emails right in your browser')
  .version(packageJson.version);

program
  .command('dev')
  .description('Starts the application in development mode')
  .option('-d, --dir <path>', 'Directory with your email templates', './emails')
  .option('-p --port <port>', 'Port to run dev server on', '3000')
  .option('-s, --skip-install', 'Do not install dependencies', false)
  .action(dev);

program
  .command('build')
  .description('Builds a production preview app')
  .option('-d, --dir <path>', 'Directory with your email templates', './emails')
  .action(buildPreview);

program
  .command('start')
  .description('Starts the production build of the preview app')
  .option('-p --port <port>', 'Port to run production server on', '3000')
  .action(startPreview);

program
  .command('export')
  .description('Build the templates to the `out` directory')
  .option('--outDir <path>', 'Output directory', 'out')
  .option('-p, --pretty', 'Pretty print the output', false)
  .option('-t, --plainText', 'Set output format as plain text', false)
  .option('-d, --dir <path>', 'Directory with your email templates', './emails')
  .action(({ outDir, pretty, plainText, dir: srcDir }) =>
    exportTemplates(outDir, srcDir, { pretty, plainText }),
  );

program.parse();
