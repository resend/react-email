#!/usr/bin/env node
import { program } from '@commander-js/extra-typings';
import { PACKAGE_NAME } from './utils/constants';
import { dev } from './commands/dev';
import { exportTemplates } from './commands/export';

program
  .name(PACKAGE_NAME)
  .description('A live preview of your emails right in your browser')
  .version('0.0.0');

program
  .command('dev')
  .description('Starts the application in development mode')
  .action(dev);

program
  .command('export')
  .description('Build the templates to the `out` directory')
  .option('--outDir <path>', 'Output directory', 'out')
  .option('-p, --pretty', 'Pretty print the output', false)
  .action(({ outDir, pretty }) => exportTemplates(outDir, pretty));

program.parse();
