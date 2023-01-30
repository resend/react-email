import {
  checkDirectoryExist,
  checkEmptyDirectory,
  checkPackageIsUpToDate,
  createDirectory,
  createWatcherInstance,
  CURRENT_PATH,
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
import { detect as detectPackageManager } from 'detect-package-manager';
import logSymbols from 'log-symbols';
import ora from 'ora';
import readPackage from 'read-pkg';
import shell from 'shelljs';
import { styles } from '../_preview/styles';

interface Args {
  dir: string;
  port: string;
}

export const dev = async ({ dir, port }: Args) => {
  const emailDir = convertToAbsolutePath(dir);
  const watcherInstance = createWatcherInstance(emailDir);
  try {
    const hasReactEmailDirectory = checkDirectoryExist(REACT_EMAIL_ROOT);
    let packageManager: PackageManager;
    try {
      packageManager = await detectPackageManager({ cwd: CURRENT_PATH });
    } catch (_) {
      packageManager = 'yarn';
    }

    if (hasReactEmailDirectory) {
      const isUpToDate = await checkPackageIsUpToDate();

      if (isUpToDate) {
        await Promise.all([generateEmailsPreview(emailDir), syncPkg()]);
        await installDependencies(packageManager);
        startDevServer(packageManager, port);
        watcher(watcherInstance, emailDir);
        return;
      }

      await fs.promises.rm(REACT_EMAIL_ROOT, { recursive: true });
    }

    await createBasicStructure();
    await createAppDirectories();
    await createAppFiles();
    await Promise.all([generateEmailsPreview(emailDir), syncPkg()]);
    await installDependencies(packageManager);
    startDevServer(packageManager, port);
    watcher(watcherInstance, emailDir);
  } catch (error) {
    await watcherInstance.close();
    shell.exit(1);
  }
};

const startDevServer = (packageManager: string, port: string) => {
  shell.exec(`${packageManager} run dev -- -p ${port}`, { async: true });
};

const convertToAbsolutePath = (dir: string): string =>
  path.isAbsolute(dir) ? dir : path.join(process.cwd(), dir);

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

    const pageCreation = pages.map(async (page) => {
      const location = page.dir
        ? `${SRC_PATH}/pages/${page.dir}/${page.title}`
        : `${SRC_PATH}/pages/${page.title}`;

      if (page.dir) {
        await createDirectory(`${SRC_PATH}/pages/${page.dir}`);
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

const generateEmailsPreview = async (emailDir: string) => {
  try {
    const spinner = ora('Generating emails preview').start();

    await createEmailPreviews(emailDir);
    await createStaticFiles(emailDir);
    await createComponents(emailDir);

    spinner.stopAndPersist({
      symbol: logSymbols.success,
      text: 'Emails preview generated',
    });
  } catch (error) {
    console.log({ error });
  }
};

const createEmailPreviews = async (emailDir: string) => {
  const hasEmailsDirectory = checkDirectoryExist(emailDir);

  const isEmailsDirectoryEmpty = hasEmailsDirectory
    ? await checkEmptyDirectory(emailDir)
    : true;

  if (isEmailsDirectoryEmpty) {
  }

  const hasPackageEmailsDirectory = checkDirectoryExist(PACKAGE_EMAILS_PATH);

  if (hasPackageEmailsDirectory) {
    await fs.promises.rm(PACKAGE_EMAILS_PATH, { recursive: true });
  }

  await copy(path.join(emailDir, '*{.tsx,.jsx}'), PACKAGE_EMAILS_PATH);
};

const createStaticFiles = async (emailDir: string) => {
  const hasPackageStaticDirectory = checkDirectoryExist(
    `${REACT_EMAIL_ROOT}/public/static`,
  );
  const staticDir = path.join(emailDir, 'static');
  const hasStaticDirectory = checkDirectoryExist(staticDir);

  if (hasPackageStaticDirectory) {
    await fs.promises.rm(`${REACT_EMAIL_ROOT}/public/static`, {
      recursive: true,
    });
  }

  if (hasStaticDirectory) {
    await copy(staticDir, `${REACT_EMAIL_ROOT}/public/static`);
  }
};

const createComponents = async (emailDir: string) => {
  const hasPackageComponentsDirectory = checkDirectoryExist(
    `${PACKAGE_EMAILS_PATH}/components`,
  );
  const componentDir = path.join(emailDir, 'components');
  const hasComponentsDirectory = checkDirectoryExist(componentDir);

  if (hasPackageComponentsDirectory) {
    await fs.promises.rm(`${PACKAGE_EMAILS_PATH}/components`, {
      recursive: true,
    });
  }

  if (hasComponentsDirectory) {
    await copy(componentDir, `${PACKAGE_EMAILS_PATH}/components`);
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
