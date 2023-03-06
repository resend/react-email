import { findRoot } from '@manypkg/find-root';
import { detect as detectPackageManager } from 'detect-package-manager';
import path from 'path';
import shell from 'shelljs';
import {
  convertToAbsolutePath,
  CURRENT_PATH,
  REACT_EMAIL_ROOT,
} from '../utils';
import { initOrSync } from './dev';

interface BuildPreviewArgs {
  dir: string;
}

export const buildPreview = async ({ dir }: BuildPreviewArgs) => {
  const emailDir = convertToAbsolutePath(dir);

  try {
    const cwd = await findRoot(CURRENT_PATH).catch(() => ({
      rootDir: CURRENT_PATH,
    }));
    const packageManager = await detectPackageManager({
      cwd: cwd.rootDir,
    }).catch(() => 'npm' as const);

    await initOrSync(packageManager, emailDir);

    buildProductionServer(packageManager);
  } catch (error) {
    shell.exit(1);
  }
};

interface StartPreviewArgs {
  port: string;
}

export const startPreview = async ({ port }: StartPreviewArgs) => {
  try {
    const cwd = await findRoot(CURRENT_PATH).catch(() => ({
      rootDir: CURRENT_PATH,
    }));
    const packageManager = await detectPackageManager({
      cwd: cwd.rootDir,
    }).catch(() => 'npm' as const);

    shell.cd(path.join(REACT_EMAIL_ROOT));

    startProductionServer(packageManager, port);
  } catch (error) {
    shell.exit(1);
  }
};

const startProductionServer = (packageManager: string, port: string) => {
  shell.exec(`${packageManager} run start -p ${port}`, {
    async: true,
  });
};

const buildProductionServer = (packageManager: string) => {
  const process = shell.exec(`${packageManager} run build`, { async: true });

  // if build fails for whatever reason, make sure the shell actually exits
  process.on('close', (code) => {
    shell.exit(code ?? undefined);
  });
};
