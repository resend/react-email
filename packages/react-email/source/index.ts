#!/usr/bin/env node
import { program } from '@commander-js/extra-typings';
import { PACKAGE_NAME } from './utils/contants';
import { dev } from './commands/dev';

program
  .name(PACKAGE_NAME)
  .description('A live preview of your emails right in your browser')
  .version('0.0.0');

program
  .command('dev')
  .description('Starts the application in development mode')
  .action(dev);

program.parse();
