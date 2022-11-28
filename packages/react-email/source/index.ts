#!/usr/bin/env node
import { program } from '@commander-js/extra-typings';
import shell from 'shelljs';
import fs from 'fs';
import path from 'path';
import {
  DEFAULT_EMAILS_DIRECTORY,
  DOT_EMAIL_DEV,
  NODE_MODULES_PACKAGE_PATH,
  PACKAGE_NAME,
} from './utils/contants';
import { watcher } from './utils/watcher';
import { checkDirectoryExist } from './utils/check-directory-exist';
import { checkEmptyDirectory } from './utils/check-empty-directory';
import { copyFiles } from './utils/copy-files';

program
  .name(PACKAGE_NAME)
  .description('A live preview of your emails right in your browser')
  .version('0.0.0');

program
  .command('dev')
  .description('Starts the application in development mode')
  .action(async () => {
    const hasEmailsDirectory = checkDirectoryExist(DEFAULT_EMAILS_DIRECTORY);

    if (!hasEmailsDirectory) {
      return console.error('Missing emails directory');
    }

    const isEmailsDirectoryEmpty = await checkEmptyDirectory(
      DEFAULT_EMAILS_DIRECTORY,
    );

    if (isEmailsDirectoryEmpty) {
      return console.error('Missing email files');
    }

    const isDependencyInstalled = checkDirectoryExist(
      NODE_MODULES_PACKAGE_PATH,
    );

    if (!isDependencyInstalled) {
      return console.error('Install the package');
    }

    const hasDotEmailDirectory = checkDirectoryExist(DOT_EMAIL_DEV);

    if (!hasDotEmailDirectory) {
      await fs.promises.mkdir(DOT_EMAIL_DEV, { recursive: true });
    }

    await copyFiles();

    shell.cd(path.join(DOT_EMAIL_DEV));
    shell.exec('yarn', { silent: true });
    shell.exec('yarn dev', { async: true });
    watcher();
  });

program.parse();
