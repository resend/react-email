#!/usr/bin/env node
/* eslint-disable */
import { program } from '@commander-js/extra-typings';
import packageJson from '../../package.json';
import { dev } from './commands/dev';
import { exportTemplates } from './commands/export';
import { PACKAGE_NAME } from './utils/constants';

program
  .name(PACKAGE_NAME)
  .description('A live preview of your emails right in your browser')
  .version(packageJson.version);

program
  .command('dev')
  .description('Starts the preview email development app')
  .option('-d, --dir <path>', 'Directory with your email templates', './emails')
  .option('-p --port <port>', 'Port to run dev server on', '3000')
  .option(
    '-sl --staticLocation <path>',
    'Base directory where the static files to load into the preview are (ex: "/public" for next)',
    './',
  )
  .action(dev);

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
