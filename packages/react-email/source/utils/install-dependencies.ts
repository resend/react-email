import shell from 'shelljs';
import path from 'path';
import { REACT_EMAIL_ROOT } from './constants';
import ora from 'ora';
import logSymbols from 'log-symbols';

export type PackageManager = 'yarn' | 'npm' | 'pnpm';

export const installDependencies = async (packageManager: PackageManager) => {
  const spinner = ora('Installing dependencies...\n').start();

  shell.cd(path.join(REACT_EMAIL_ROOT));
  shell.exec(`${packageManager} install`);
  spinner.stopAndPersist({
    symbol: logSymbols.success,
    text: 'Dependencies installed',
  });
};
