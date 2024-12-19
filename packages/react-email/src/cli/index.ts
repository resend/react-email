#!/usr/bin/env node
import { program } from 'commander';
import packageJson from '../../package.json';
import { build } from './commands/build';
import { dev } from './commands/dev';
import { exportTemplates } from './commands/export';
import { start } from './commands/start';

const PACKAGE_NAME = 'react-email';

program
  .name(PACKAGE_NAME)
  .description('A live preview of your emails right in your browser')
  .version(packageJson.version);

program
  .command('dev')
  .description('Starts the preview email development app')
  .option('-d, --dir <path>', 'Directory with your email templates', './emails')
  .option('-p --port <port>', 'Port to run dev server on', '3000')
  .action(dev);

program
  .command('build')
  .description('Copies the preview app for onto .react-email and builds it')
  .option('-d, --dir <path>', 'Directory with your email templates', './emails')
  .option(
    '-p --packageManager <name>',
    'Package name to use on installation on `.react-email`',
    'npm',
  )
  .action(build);

program
  .command('start')
  .description('Runs the built preview app that is inside of ".react-email"')
  .action(start);

program
  .command('export')
  .description('Build the templates to the `out` directory')
  .option('--outDir <path>', 'Output directory', 'out')
  .option('-p, --pretty', 'Pretty print the output', false)
  .option('-t, --plainText', 'Set output format as plain text', false)
  .option('-d, --dir <path>', 'Directory with your email templates', './emails')
  .option(
    '-s, --silent',
    'To, or not to show a spinner with process information',
    false,
  )
  .action(({ outDir, pretty, plainText, silent, dir: srcDir }) =>
    exportTemplates(outDir, srcDir, { pretty, silent, plainText }),
  );

program.parse();
