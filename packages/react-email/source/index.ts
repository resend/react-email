#!/usr/bin/env node
import { program } from '@commander-js/extra-typings';
import { PACKAGE_NAME } from './utils/constants';
import { dev } from './commands/dev';
import { exportTemplates } from './commands/export';
import packageJson from '../package.json';

program
  .name(PACKAGE_NAME)
  .description('A live preview of your emails right in your browser')
  .version(packageJson.version);

program
  .command('dev')
  .description('Starts the application in development mode')
  .action(dev);

program
  .command('export')
  .description('Build the templates to the `out` directory')
  .option('--outDir <path>', 'Output directory', 'out')
  .option('-p, --pretty', 'Pretty print the output', false)
  .option('-t, --plainText', 'Set output format as plain Text', false)
  .action(({ outDir, pretty, plainText }) =>
    exportTemplates(outDir, { pretty, plainText }),
  );

program.parse();
