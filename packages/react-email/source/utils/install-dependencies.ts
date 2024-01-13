import path from 'node:path';
import shell from 'shelljs';
import logSymbols from 'log-symbols';
import { OurSpinner } from './our-spinner';
import { REACT_EMAIL_ROOT } from './constants';

export type PackageManager = 'yarn' | 'npm' | 'pnpm';

export const installDependencies = (packageManager: PackageManager) => {
  const spinner = new OurSpinner('Installing dependencies...\n').start();

  shell.cd(path.join(REACT_EMAIL_ROOT));
  shell.exec(`${packageManager} install`);
  spinner.stopAndPersist({
    symbol: logSymbols.success,
    text: 'Dependencies installed',
  });
};
