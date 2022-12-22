import {
  checkDirectoryExist,
  checkEmptyDirectory,
  checkPackageIsUpToDate,
  CLIENT_EMAILS_PATH,
  createDirectory,
  PACKAGE_EMAILS_PATH,
  REACT_EMAIL_ROOT,
  SRC_PATH,
  getPreviewPkg,
  watcher,
  PUBLIC_PATH,
} from '../utils';
import path from 'path';
import fs from 'fs';
import { components } from '../_preview/components';
import { utils } from '../_preview/utils';
import { root } from '../_preview/root';
import { pages } from '../_preview/pages';
import copy from 'cpy';
import logSymbols from 'log-symbols';
import ora from 'ora';
import readPackage from 'read-pkg';
import shell from 'shelljs';
import { styles } from '../_preview/styles';

export const dev = async () => {
  const hasReactEmailDirectory = checkDirectoryExist(REACT_EMAIL_ROOT);

  if (hasReactEmailDirectory) {
    const isUpToDate = await checkPackageIsUpToDate();

    if (isUpToDate) {
      await Promise.all([generateEmailsPreview(), syncPkg()]);
      await installDependencies();
      shell.exec('yarn dev', { async: true });
      watcher();
      return;
    }

    await fs.promises.rm(REACT_EMAIL_ROOT, { recursive: true });
  }

  await createBasicStructure();
  await createAppDirectories();
  await createAppFiles();
  await Promise.all([generateEmailsPreview(), syncPkg()]);
  await installDependencies();
  shell.exec('yarn dev', { async: true });
  watcher();
};

const createBasicStructure = async () => {
  try {
    // Create `.react-email` directory
    await createDirectory(REACT_EMAIL_ROOT);

    // Create `src` and `public` directories
    await Promise.all([
      createDirectory(SRC_PATH),
      createDirectory(PUBLIC_PATH),
    ]);
  } catch (error) {
    throw new Error('Error creating the basic structure');
  }
};

const createAppDirectories = async () => {
  try {
    await Promise.all([
      createDirectory(path.join(SRC_PATH, 'components')),
      createDirectory(path.join(SRC_PATH, 'utils')),
      createDirectory(path.join(SRC_PATH, 'pages')),
      createDirectory(path.join(SRC_PATH, 'styles')),
    ]);
  } catch (error) {
    throw new Error('Error creating app directories');
  }
};

type AppFile = { content: string; title: string; dir?: string };

const createAppFiles = async () => {
  const creation = (appFiles: AppFile[], name?: string) => {
    return appFiles.map((file) => {
      const location = name
        ? `${SRC_PATH}/${name}/${file.title}`
        : `${REACT_EMAIL_ROOT}/${file.title}`;
      return fs.promises.writeFile(location, file.content);
    });
  };

  const pageCreation = pages.map((page) => {
    const location = page.dir
      ? `${SRC_PATH}/pages/${page.dir}/${page.title}`
      : `${SRC_PATH}/pages/${page.title}`;

    if (page.dir) {
      createDirectory(`${SRC_PATH}/pages/${page.dir}`);
    }

    return fs.promises.writeFile(location, page.content);
  });

  await Promise.all([
    ...creation(utils, 'utils'),
    ...creation(components, 'components'),
    ...creation(styles, 'styles'),
    ...creation(root),
    ...pageCreation,
  ]);
};

const generateEmailsPreview = async () => {
  const spinner = ora('Generating emails preview').start();

  const hasEmailsDirectory = fs.existsSync(CLIENT_EMAILS_PATH);
  const isEmailsDirectoryEmpty = hasEmailsDirectory
    ? await checkEmptyDirectory(CLIENT_EMAILS_PATH)
    : true;

  if (isEmailsDirectoryEmpty) {
    return spinner.stopAndPersist({
      symbol: logSymbols.warning,
      text: 'Emails preview directory is empty',
    });
  }

  const hasPackageEmailsDirectory = checkDirectoryExist(PACKAGE_EMAILS_PATH);
  const hasPackageStaticDirectory = checkDirectoryExist(
    `${REACT_EMAIL_ROOT}/public/static`,
  );
  const hasStaticDirectory = checkDirectoryExist(
    `${CLIENT_EMAILS_PATH}/static`,
  );

  if (hasPackageEmailsDirectory) {
    await fs.promises.rm(PACKAGE_EMAILS_PATH, { recursive: true });
  }

  await copy(`${CLIENT_EMAILS_PATH}/*{.tsx,.jsx}`, PACKAGE_EMAILS_PATH);

  if (hasPackageStaticDirectory) {
    await fs.promises.rm(`${REACT_EMAIL_ROOT}/public/static`, {
      recursive: true,
    });
  }

  if (hasStaticDirectory) {
    await copy(
      `${CLIENT_EMAILS_PATH}/static`,
      `${REACT_EMAIL_ROOT}/public/static`,
    );
  }

  return spinner.stopAndPersist({
    symbol: logSymbols.success,
    text: 'Emails preview generated',
  });
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

const installDependencies = async () => {
  const spinner = ora('Installing dependencies...').start();

  shell.cd(path.join(REACT_EMAIL_ROOT));
  shell.exec('yarn');
  spinner.stopAndPersist({
    symbol: logSymbols.success,
    text: 'Dependencies installed',
  });
};
