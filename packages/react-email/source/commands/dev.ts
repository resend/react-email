import { checkDirectoryExist } from '../utils/check-directory-exist';
import { components } from '../_preview/components';
import { createDirectory } from '../utils/create-directory';
import { pages } from '../_preview/pages';
import {
  CLIENT_EMAILS_PATH,
  PACKAGE_EMAILS_PATH,
  REACT_EMAIL_ROOT,
} from '../utils/constants';
import { root } from '../_preview/root';
import { styles } from '../_preview/styles';
import { utils } from '../_preview/utils';
import fs from 'fs';
import logSymbols from 'log-symbols';
import ora from 'ora';
import path from 'path';
import readPackage from 'read-pkg';
import shell from 'shelljs';
import { watcher } from '../utils/watcher';
import copy from 'cpy';

export const dev = async () => {
  await prepareFiles();
  await checkForUpdates();
  await generateEmailsPreview();
  await syncPkg();
  await installDependencies();

  shell.exec('yarn dev', { async: true });
  watcher();
};

const prepareFiles = async () => {
  const spinner = ora('Preparing React Email files...').start();
  const isFirstTime = !checkDirectoryExist(REACT_EMAIL_ROOT);

  if (isFirstTime) {
    await createDirectory(REACT_EMAIL_ROOT);
    await createDirectory(path.join(REACT_EMAIL_ROOT, 'src'));
    await createDirectory(path.join(REACT_EMAIL_ROOT, 'public'));

    await Promise.all([
      createFilesAndDirectories(components, 'components'),
      createFilesAndDirectories(utils, 'utils'),
      createFilesAndDirectories(styles, 'styles'),
      createFilesAndDirectories(root),
      createFilesAndDirectories(pages, 'pages'),
    ]);
  }

  spinner.stopAndPersist({
    symbol: logSymbols.success,
    text: 'React Email files ready',
  });
};

const checkForUpdates = async () => {
  const spinner = ora('Checking for updates...').start();
  const reactEmailPkg = await fs.promises.readFile(
    path.join(REACT_EMAIL_ROOT, 'package.json'),
    { encoding: 'utf8' },
  );
  const isUpToDate =
    JSON.parse(reactEmailPkg).version === getPreviewPkg().version;

  if (isUpToDate) {
    return spinner.stopAndPersist({
      symbol: logSymbols.success,
      text: 'React Email is up-to-date',
    });
  }

  return updatePackage();
};

const updatePackage = async () => {
  const spinner = ora('Updating React Email...').start();

  await Promise.all([
    createFilesAndDirectories(utils, 'utils'),
    createFilesAndDirectories(styles, 'styles'),
    createFilesAndDirectories(root),
    createFilesAndDirectories(pages, 'pages'),
  ]);

  spinner.stopAndPersist({
    symbol: logSymbols.success,
    text: 'React Email is updated',
  });
};

const generateEmailsPreview = async () => {
  const spinner = ora('Generating emails preview').start();
  const hasEmailsDirectory = fs.existsSync(CLIENT_EMAILS_PATH);
  const hasPackageEmailsDirectory = fs.existsSync(PACKAGE_EMAILS_PATH);
  const hasPackagePublicDirectory = fs.existsSync(
    `${REACT_EMAIL_ROOT}/public/static`,
  );

  if (hasEmailsDirectory) {
    if (hasPackageEmailsDirectory) {
      await fs.promises.rm(PACKAGE_EMAILS_PATH, { recursive: true });
    }

    if (hasPackagePublicDirectory) {
      await fs.promises.rm(`${REACT_EMAIL_ROOT}/public`, {
        recursive: true,
      });
    }

    await copy(`${CLIENT_EMAILS_PATH}/*{.tsx,.jsx}`, PACKAGE_EMAILS_PATH);
    await copy(
      `${CLIENT_EMAILS_PATH}/static`,
      `${REACT_EMAIL_ROOT}/public/static`,
    );
    return spinner.stopAndPersist({
      symbol: logSymbols.success,
      text: 'Emails preview generated',
    });
  }

  fs.promises.mkdir(CLIENT_EMAILS_PATH);
  return spinner.stopAndPersist({
    symbol: logSymbols.warning,
    text: 'Emails preview directory is empty',
  });
};

const installDependencies = async () => {
  const spinner = ora('Installing dependencies...').start();

  shell.cd(path.join(REACT_EMAIL_ROOT));
  shell.exec('yarn', { silent: true });
  spinner.stopAndPersist({
    symbol: logSymbols.success,
    text: 'Dependencies installed',
  });
};

const createFilesAndDirectories = async (
  arr: { content: string; title: string; dir?: string }[],
  dir?: string,
) => {
  if (dir) {
    await createDirectory(path.join(REACT_EMAIL_ROOT, 'src', dir));
  }

  const list = arr.map(async ({ content, title, dir: dirName }) => {
    if (dirName && dir) {
      await createDirectory(path.join(REACT_EMAIL_ROOT, 'src', dir, dirName));
    }

    const pathDir = dir
      ? dirName
        ? path.join(REACT_EMAIL_ROOT, 'src', dir, dirName, title)
        : path.join(REACT_EMAIL_ROOT, 'src', dir, title)
      : path.join(REACT_EMAIL_ROOT, title);
    await fs.promises.writeFile(pathDir, content);
  });

  await Promise.all(list);
};

const syncPkg = async () => {
  const previewPkg = getPreviewPkg();
  const clientPkg = await readPackage();
  const pkg = {
    ...previewPkg,
    dependencies: {
      ...previewPkg.dependencies,
      ...clientPkg.dependencies,
    },
  };
  await fs.promises.writeFile(
    path.join(REACT_EMAIL_ROOT, 'package.json'),
    JSON.stringify(pkg),
  );
};

const getPreviewPkg = () => {
  const [previewPkg] = root.filter((pkg) => pkg.title === 'package.json');
  return JSON.parse(previewPkg?.content || '');
};
