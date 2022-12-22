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
  watcherInstance,
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
  try {
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
  } catch (error) {
    await watcherInstance.close();
    shell.exit(1);
  }
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
  try {
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
  } catch (error) {
    throw new Error('Error creating app files');
  }
};

const generateEmailsPreview = async () => {
  try {
    const spinner = ora('Generating emails preview').start();

    await createEmailPreviews();
    await createStatisFiles();
    await createComponents();

    spinner.stopAndPersist({
      symbol: logSymbols.success,
      text: 'Emails preview generated',
    });
  } catch (error) {
    console.log({ error });
  }
};

const createEmailPreviews = async () => {
  const hasEmailsDirectory = checkDirectoryExist(CLIENT_EMAILS_PATH);

  const isEmailsDirectoryEmpty = hasEmailsDirectory
    ? await checkEmptyDirectory(CLIENT_EMAILS_PATH)
    : true;

  if (isEmailsDirectoryEmpty) {
  }

  const hasPackageEmailsDirectory = checkDirectoryExist(PACKAGE_EMAILS_PATH);

  if (hasPackageEmailsDirectory) {
    await fs.promises.rm(PACKAGE_EMAILS_PATH, { recursive: true });
  }

  await copy(`${CLIENT_EMAILS_PATH}/*{.tsx,.jsx}`, PACKAGE_EMAILS_PATH);
};

const createStatisFiles = async () => {
  const hasPackageStaticDirectory = checkDirectoryExist(
    `${REACT_EMAIL_ROOT}/public/static`,
  );
  const hasStaticDirectory = checkDirectoryExist(
    `${CLIENT_EMAILS_PATH}/static`,
  );

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
};

const createComponents = async () => {
  const hasPackageComponentsDirectory = checkDirectoryExist(
    `${PACKAGE_EMAILS_PATH}/components`,
  );

  const hasComponentsDirectory = checkDirectoryExist(
    `${CLIENT_EMAILS_PATH}/components`,
  );

  if (hasPackageComponentsDirectory) {
    await fs.promises.rm(`${PACKAGE_EMAILS_PATH}/components`, {
      recursive: true,
    });
  }

  if (hasComponentsDirectory) {
    await copy(
      `${CLIENT_EMAILS_PATH}/components`,
      `${PACKAGE_EMAILS_PATH}/components`,
    );
  }
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
  const spinner = ora('Installing dependencies...\n').start();

  shell.cd(path.join(REACT_EMAIL_ROOT));
  shell.exec('yarn');
  spinner.stopAndPersist({
    symbol: logSymbols.success,
    text: 'Dependencies installed',
  });
};
