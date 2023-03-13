import { createWatcherInstance, watcher } from './watcher';
import { detect as detectPackageManager } from 'detect-package-manager';
import { findRoot } from '@manypkg/find-root';
import {
  CURRENT_PATH,
  convertToAbsolutePath,
  startDevServer,
  installDependencies,
  PackageManager,
  syncPkg,
  generateEmailsPreview,
} from '.';

export const runServer = async (dir: string, port: string) => {
  const cwd = await findRoot(CURRENT_PATH).catch(() => ({
    rootDir: CURRENT_PATH,
  }));
  const emailDir = convertToAbsolutePath(dir);
  const watcherInstance = createWatcherInstance(emailDir);
  const packageManager: PackageManager = await detectPackageManager({
    cwd: cwd.rootDir,
  }).catch(() => 'npm');

  await generateEmailsPreview(emailDir);
  await syncPkg();
  await installDependencies(packageManager);
  startDevServer(packageManager, port);
  watcher(watcherInstance, emailDir);
};
