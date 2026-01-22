import fs from 'node:fs';
import path from 'node:path';
import { getPackages } from '@manypkg/get-packages';
import logSymbols from 'log-symbols';
import { type PackageManagerName, runScript } from 'nypm';
import ora from 'ora';
import {
  type EmailsDirectory,
  getEmailsDirectoryMetadata,
} from '../utils/get-emails-directory-metadata.js';
import { getPreviewServerLocation } from '../utils/get-preview-server-location.js';
import { registerSpinnerAutostopping } from '../utils/register-spinner-autostopping.js';

interface Args {
  dir: string;
  packageManager: PackageManagerName;
}

const setNextEnvironmentVariablesForBuild = async (
  emailsDirRelativePath: string,
  appPath: string,
  rootDirectory: string,
) => {
  const nextConfigContents = `
import path from 'path';
const emailsDirRelativePath = path.normalize('${emailsDirRelativePath}');
const userProjectLocation = '${process.cwd().replace(/\\/g, '/')}';
const previewServerLocation = '${appPath.replace(/\\/g, '/')}';
const rootDirectory = '${rootDirectory.replace(/\\/g, '/')}';
/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_IS_BUILDING: 'true',
    EMAILS_DIR_RELATIVE_PATH: emailsDirRelativePath,
    EMAILS_DIR_ABSOLUTE_PATH: path.resolve(userProjectLocation, emailsDirRelativePath),
    PREVIEW_SERVER_LOCATION: previewServerLocation,
    USER_PROJECT_LOCATION: userProjectLocation
  },
  turbopack: {
    root: rootDirectory,
  },
  outputFileTracingRoot: rootDirectory,
  serverExternalPackages: ['esbuild'],
  typescript: {
    ignoreBuildErrors: true
  },
  staticPageGenerationTimeout: 600,
}

export default nextConfig`;

  await fs.promises.writeFile(
    path.resolve(appPath, './next.config.mjs'),
    nextConfigContents,
    'utf8',
  );
};

const getEmailSlugsFromEmailDirectory = (
  emailDirectory: EmailsDirectory,
  emailsDirectoryAbsolutePath: string,
) => {
  const directoryPathRelativeToEmailsDirectory = emailDirectory.absolutePath
    .replace(emailsDirectoryAbsolutePath, '')
    .trim();

  const slugs = [] as Array<string>[];
  for (const filename of emailDirectory.emailFilenames) {
    slugs.push(
      path
        .join(directoryPathRelativeToEmailsDirectory, filename)
        .split(path.sep)
        // sometimes it gets empty segments due to trailing slashes
        .filter((segment) => segment.length > 0),
    );
  }
  for (const directory of emailDirectory.subDirectories) {
    slugs.push(
      ...getEmailSlugsFromEmailDirectory(
        directory,
        emailsDirectoryAbsolutePath,
      ),
    );
  }

  return slugs;
};

// we do this because otherwise it won't be able to find the emails
// after build
const forceSSGForEmailPreviews = async (
  emailsDirPath: string,
  appPath: string,
) => {
  const emailDirectoryMetadata = (await getEmailsDirectoryMetadata(
    emailsDirPath,
  ))!;

  const parameters = getEmailSlugsFromEmailDirectory(
    emailDirectoryMetadata,
    emailsDirPath,
  ).map((slug) => ({ slug }));

  const removeForceDynamic = async (filePath: string) => {
    const contents = await fs.promises.readFile(filePath, 'utf8');

    await fs.promises.writeFile(
      filePath,
      contents.replace("export const dynamic = 'force-dynamic';", ''),
      'utf8',
    );
  };
  await removeForceDynamic(path.resolve(appPath, './src/app/layout.tsx'));
  await removeForceDynamic(
    path.resolve(appPath, './src/app/preview/[...slug]/page.tsx'),
  );

  await fs.promises.appendFile(
    path.resolve(appPath, './src/app/preview/[...slug]/page.tsx'),
    `

export function generateStaticParams() { 
  return Promise.resolve(
    ${JSON.stringify(parameters)}
  );
}`,
    'utf8',
  );
};

const updatePackageJson = async (appPath: string) => {
  const packageJsonPath = path.resolve(appPath, './package.json');
  const packageJson = JSON.parse(
    await fs.promises.readFile(packageJsonPath, 'utf8'),
  ) as {
    name: string;
    scripts: Record<string, string>;
    dependencies: Record<string, string>;
    devDependencies: Record<string, string>;
  };
  packageJson.scripts.build =
    'cross-env NODE_OPTIONS="--experimental-vm-modules --disable-warning=ExperimentalWarning" next build';
  packageJson.scripts.start =
    'cross-env NODE_OPTIONS="--experimental-vm-modules --disable-warning=ExperimentalWarning" next start';

  delete packageJson.scripts.prepare;

  await fs.promises.writeFile(
    packageJsonPath,
    JSON.stringify(packageJson),
    'utf8',
  );
};

export const build = async ({
  dir: emailsDirRelativePath,
  packageManager,
}: Args) => {
  try {
    const previewServerLocation = await getPreviewServerLocation();
    const { rootDir: rootDirectory } = await getPackages(process.cwd());

    const spinner = ora({
      text: 'Starting build process...',
      prefixText: '  ',
    }).start();
    registerSpinnerAutostopping(spinner);

    spinner.text = `Checking if ${emailsDirRelativePath} folder exists`;
    if (!fs.existsSync(emailsDirRelativePath)) {
      spinner.stopAndPersist({
        symbol: logSymbols.error,
        text: `Directory does not exist: ${emailsDirRelativePath}`,
      });
      process.exit(1);
    }

    const emailsDirPath = path.join(process.cwd(), emailsDirRelativePath);
    const staticPath = path.join(emailsDirPath, 'static');

    const builtPreviewAppPath = path.join(process.cwd(), '.react-email');

    if (fs.existsSync(builtPreviewAppPath)) {
      spinner.text = 'Deleting pre-existing `.react-email` folder';
      await fs.promises.rm(builtPreviewAppPath, { recursive: true });
    }

    spinner.text = 'Copying UI source to `.react-email`';
    await fs.promises.cp(previewServerLocation, builtPreviewAppPath, {
      recursive: true,
      filter: (source: string) => {
        const relativeSource = path.relative(previewServerLocation, source);
        return (
          !/\.next/.test(relativeSource) && !/\.turbo/.test(relativeSource)
        );
      },
    });

    if (fs.existsSync(staticPath)) {
      spinner.text =
        'Copying `static` folder into `.react-email/public/static`';
      const builtStaticDirectory = path.resolve(
        builtPreviewAppPath,
        './public/static',
      );
      await fs.promises.cp(staticPath, builtStaticDirectory, {
        recursive: true,
      });
    }

    spinner.text =
      'Setting Next environment variables for preview app to work properly';
    await setNextEnvironmentVariablesForBuild(
      emailsDirRelativePath,
      builtPreviewAppPath,
      rootDirectory,
    );

    spinner.text = 'Setting server side generation for the email preview pages';
    await forceSSGForEmailPreviews(emailsDirPath, builtPreviewAppPath);

    spinner.text = "Updating package.json's build and start scripts";
    await updatePackageJson(builtPreviewAppPath);

    spinner.stopAndPersist({
      text: 'Successfully prepared `.react-email` for `next build`',
      symbol: logSymbols.success,
    });

    await runScript('build', {
      packageManager,
      cwd: builtPreviewAppPath,
    });
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
