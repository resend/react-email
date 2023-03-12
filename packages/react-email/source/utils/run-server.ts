import { createWatcherInstance, watcher } from './watcher';
import path from 'path';
import ora from 'ora';
import shell from 'shelljs';
import {
  CURRENT_PATH,
  PACKAGE_EMAILS_PATH,
  REACT_EMAIL_ROOT,
} from './constants';
import { detect as detectPackageManager } from 'detect-package-manager';
import { findRoot } from '@manypkg/find-root';
import logSymbols from 'log-symbols';
import fs from 'fs';
import fse from 'fs-extra';
import { convertToAbsolutePath } from './convert-to-absolute-path';

export const runServer = async (dir: string, port: string) => {
  const emailDir = convertToAbsolutePath(dir);
  const watcherInstance = createWatcherInstance(emailDir);
  const cwd = await findRoot(CURRENT_PATH).catch(() => ({
    rootDir: CURRENT_PATH,
  }));
  const packageManager: PackageManager = await detectPackageManager({
    cwd: cwd.rootDir,
  }).catch(() => 'npm');
  await generateEmailsPreview(emailDir);
  await installDependencies(packageManager);
  startDevServer(packageManager, port);
  watcher(watcherInstance, emailDir);
};

const startDevServer = (packageManager: string, port: string) => {
  shell.exec(`${packageManager} run dev -p ${port}`, { async: true });
};

type PackageManager = 'yarn' | 'npm' | 'pnpm';

const installDependencies = async (packageManager: PackageManager) => {
  const spinner = ora('Installing dependencies...\n').start();

  shell.cd(path.join(REACT_EMAIL_ROOT));
  shell.exec(`${packageManager} install`);
  spinner.stopAndPersist({
    symbol: logSymbols.success,
    text: 'Dependencies installed',
  });
};

const generateEmailsPreview = async (emailDir: string) => {
  try {
    const spinner = ora('Generating emails preview').start();

    await createEmailPreviews(emailDir);
    await createStaticFiles(emailDir);

    spinner.stopAndPersist({
      symbol: logSymbols.success,
      text: 'Emails preview generated',
    });
  } catch (error) {
    console.log({ error });
  }
};

const createEmailPreviews = async (emailDir: string) => {
  const hasPackageEmailsDirectory = fs.existsSync(PACKAGE_EMAILS_PATH);

  if (hasPackageEmailsDirectory) {
    await fs.promises.rm(PACKAGE_EMAILS_PATH, { recursive: true });
  }

  const result = shell.cp('-r', emailDir, PACKAGE_EMAILS_PATH);

  if (result.code > 0) {
    throw new Error(
      `Something went wrong while copying the file to ${PACKAGE_EMAILS_PATH}, ${result.cat()}`,
    );
  }
};

const createStaticFiles = async (emailDir: string) => {
  const reactEmailPublicFolder = path.join(REACT_EMAIL_ROOT, 'public');
  fse.ensureDir(reactEmailPublicFolder);
  const hasPackageStaticDirectory = fs.existsSync(reactEmailPublicFolder);
  if (hasPackageStaticDirectory) {
    await fs.promises.rm(reactEmailPublicFolder, {
      recursive: true,
    });
  }

  // Make sure that the "static" folder does not exists in .react-email/emails
  // since it should only exists in .react-email/public, but the "createEmailPreviews"-function will blindly copy the complete emails folder
  const reactEmailEmailStaticFolder = path.join(
    REACT_EMAIL_ROOT,
    'emails',
    'static',
  );
  const hasPackageStaticDirectoryInEmails = fs.existsSync(
    reactEmailEmailStaticFolder,
  );
  if (hasPackageStaticDirectoryInEmails) {
    await fs.promises.rm(reactEmailEmailStaticFolder, {
      recursive: true,
    });
  }

  const staticDir = path.join(emailDir, 'static');
  const hasStaticDirectory = fs.existsSync(staticDir);

  if (hasStaticDirectory) {
    const result = shell.cp('-r', staticDir, reactEmailPublicFolder);
    if (result.code > 0) {
      throw new Error(
        `Something went wrong while copying the file to ${reactEmailPublicFolder}, ${result.cat()}`,
      );
    }
  }
};
