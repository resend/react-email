import path from 'node:path';
import shell from 'shelljs';
import ora from 'ora';
import logSymbols from 'log-symbols';
import { PREVIEW_CLIENT_DIR } from './constants';
import { closeOraOnSIGNIT } from './close-ora-on-sigint';

export type PackageManager = 'yarn' | 'npm' | 'pnpm';

export const installDependencies = (packageManager: PackageManager) => {
  const spinner = ora('Installing dependencies...\n').start();
  closeOraOnSIGNIT(spinner);

  shell.cd(path.join(PREVIEW_CLIENT_DIR));
  shell.exec(`${packageManager} install`);
  spinner.stopAndPersist({
    symbol: logSymbols.success,
    text: 'Dependencies installed',
  });
};
