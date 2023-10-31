#!/usr/bin/env node
import { program } from '@commander-js/extra-typings';
import packageJson from '../package.json';
import { dev } from './commands/dev';
import { exportTemplates } from './commands/export';

program
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
  .name(packageJson.name)
  .description('A live preview of your emails right in your browser')
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
  .version(packageJson.version);

program
  .command('dev')
  .description('Starts the application in development mode')
  .option('-d, --dir <path>', 'Directory with your email templates', './emails')
  .option('-p --port <port>', 'Port to run dev server on', '3000')
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
