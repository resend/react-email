import path from 'node:path';
import type { PM } from 'detect-package-manager';
import logSymbols from 'log-symbols';
import ora from 'ora';
import shell from 'shelljs';
import { closeOraOnSIGNIT } from './close-ora-on-sigint';
import { REACT_EMAIL_ROOT } from './constants';

export const installDependencies = (packageManager: PM) => {
  const spinner = ora('Installing dependencies...\n').start();
  closeOraOnSIGNIT(spinner);

  shell.cd(path.join(REACT_EMAIL_ROOT));
  shell.exec(`${packageManager} install`);
  spinner.stopAndPersist({
    symbol: logSymbols.success,
    text: 'Dependencies installed',
  });
};
