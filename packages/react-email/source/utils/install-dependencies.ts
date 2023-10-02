import path from 'node:path';
import shell from 'shelljs';
import ora from 'ora';
import logSymbols from 'log-symbols';
import { REACT_EMAIL_ROOT } from './constants';
import { closeOraOnSIGNIT } from './close-ora-on-sigint';

export type PackageManager = 'yarn' | 'npm' | 'pnpm';

export const installDependencies = (packageManager: PackageManager) => {
  const spinner = ora('Installing dependencies...\n').start();
  closeOraOnSIGNIT(spinner);

  shell.cd(path.join(REACT_EMAIL_ROOT));
  shell.exec(`${packageManager} install`);
  spinner.stopAndPersist({
    symbol: logSymbols.success,
    text: 'Dependencies installed',
  });
};
