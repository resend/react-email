import fs from 'node:fs';
import path from 'node:path';
import { getPackages } from '@manypkg/get-packages';
import logSymbols from 'log-symbols';
import { runScript } from 'nypm';
import ora from 'ora';
import {
  type EmailsDirectory,
  getEmailsDirectoryMetadata,
} from '../utils/get-emails-directory-metadata.js';
import { getPreviewServerLocation } from '../utils/get-preview-server-location.js';
import { registerSpinnerAutostopping } from '../utils/register-spinner-autostopping.js';

interface Args {
  dir: string;
  packageManager?: string;
}

const setNextEnvironmentVariablesForBuild = async (
  emailsDirRelativePath: string,
  modifiedPreviewAppPath: string,
  rootDirectory: string,
) => {
  const nextConfigContents = `
import path from 'path';
const emailsDirRelativePath = path.normalize('${emailsDirRelativePath}');
const userProjectLocation = '${process.cwd().replace(/\\/g, '/')}';
const previewServerLocation = import.meta.dirname.replace(/\\\\/g, '/');
const rootDirectory = '${rootDirectory}';
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
    path.resolve(modifiedPreviewAppPath, './next.config.mjs'),
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
  builtPreviewAppPath: string,
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
  await removeForceDynamic(
    path.resolve(builtPreviewAppPath, './src/app/layout.tsx'),
  );
  await removeForceDynamic(
    path.resolve(builtPreviewAppPath, './src/app/preview/[...slug]/page.tsx'),
  );

  await fs.promises.appendFile(
    path.resolve(builtPreviewAppPath, './src/app/preview/[...slug]/page.tsx'),
    `

export function generateStaticParams() { 
  return Promise.resolve(
    ${JSON.stringify(parameters)}
  );
}`,
    'utf8',
  );
};

const updatePackageJson = async (builtPreviewAppPath: string) => {
  const packageJsonPath = path.resolve(builtPreviewAppPath, './package.json');
  const packageJson = JSON.parse(
    await fs.promises.readFile(packageJsonPath, 'utf8'),
  ) as {
    name: string;
    scripts: Record<string, string>;
    dependencies: Record<string, string>;
    devDependencies: Record<string, string>;
  };
  // Turbopack has some errors with the imports in @react-email/tailwind
  packageJson.scripts.build =
    'cross-env NODE_OPTIONS="--experimental-vm-modules --disable-warning=ExperimentalWarning" next build';
  packageJson.scripts.start =
    'cross-env NODE_OPTIONS="--experimental-vm-modules --disable-warning=ExperimentalWarning" next start';
  delete packageJson.scripts.postbuild;

  packageJson.name = 'preview-server';

  for (const [dependency, version] of Object.entries(
    packageJson.devDependencies,
  )) {
    packageJson.devDependencies[dependency] = version.replace('workspace:', '');
  }

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
  if (packageManager !== undefined) {
    console.warn(
      'The --packageManager flag is deprecated and is currently ignored. It will be removed in the next major version',
    );
  }

  try {
    const { rootDir: rootDirectory } = await getPackages(process.cwd());

    const previewServerLocation = await getPreviewServerLocation();

    const spinner = ora({
      text: 'Starting build process...',
      prefixText: '  ',
    }).start();
    registerSpinnerAutostopping(spinner);

    spinner.text = `Checking if ${emailsDirRelativePath} folder exists`;
    if (!fs.existsSync(emailsDirRelativePath)) {
      process.exit(1);
    }

    const emailsDirPath = path.join(process.cwd(), emailsDirRelativePath);
    const staticPath = path.join(emailsDirPath, 'static');

    const modifiedPreviewAppPath = path.resolve(
      previewServerLocation,
      '../.react-email',
    );
    if (fs.existsSync(modifiedPreviewAppPath)) {
      spinner.text = 'Deleting pre-existing modified preview app folder';
      await fs.promises.rm(modifiedPreviewAppPath, { recursive: true });
    }
    const builtPreviewAppPath = path.join(process.cwd(), '.react-email');
    if (fs.existsSync(builtPreviewAppPath)) {
      spinner.text = 'Deleting pre-existing .react-email folder';
      await fs.promises.rm(builtPreviewAppPath, { recursive: true });
    }

    spinner.text = 'Copying preview app from CLI to modify it';
    await fs.promises.cp(previewServerLocation, modifiedPreviewAppPath, {
      recursive: true,
      filter: (source: string) => {
        return (
          !/(\/|\\)cli(\/|\\)?/.test(source) &&
          !/(\/|\\)\.next(\/|\\)?/.test(source) &&
          !/(\/|\\)\.turbo(\/|\\)?/.test(source)
        );
      },
    });

    if (fs.existsSync(staticPath)) {
      spinner.text = 'Copying static directory';
      const modifiedPreviewAppStaticDirectory = path.resolve(
        modifiedPreviewAppPath,
        './public/static',
      );
      await fs.promises.cp(staticPath, modifiedPreviewAppStaticDirectory, {
        recursive: true,
      });
    }

    spinner.text = 'Setting Next environment variables';
    await setNextEnvironmentVariablesForBuild(
      emailsDirRelativePath,
      modifiedPreviewAppPath,
      rootDirectory,
    );

    spinner.text = 'Setting up server side generation';
    await forceSSGForEmailPreviews(emailsDirPath, modifiedPreviewAppPath);

    spinner.text = "Updating package.json's build and start scripts";
    await updatePackageJson(modifiedPreviewAppPath);

    spinner.stopAndPersist({
      text: 'Ready for next build',
      symbol: logSymbols.success,
    });
    await runScript('build', {
      cwd: modifiedPreviewAppPath,
      packageManager: 'npm',
    });

    await fs.promises.mkdir(builtPreviewAppPath);
    await fs.promises.cp(
      path.join(modifiedPreviewAppPath, '.next'),
      path.join(builtPreviewAppPath, '.next'),
      {
        recursive: true,
      },
    );
    await fs.promises.cp(
      path.join(modifiedPreviewAppPath, 'public'),
      path.join(builtPreviewAppPath, 'public'),
      {
        recursive: true,
      },
    );

    await fs.promises.rm(modifiedPreviewAppPath, {
      recursive: true,
    });
    let filesPath = path.join(
      builtPreviewAppPath,
      '.next/next-minimal-server.js.nft.json',
    );
    let filesJson: { version: string; files: string[] } = JSON.parse(
      await fs.promises.readFile(filesPath, 'utf8'),
    );
    for (const [i, file] of filesJson.files.entries()) {
      filesJson.files[i] = path.relative(
        path.resolve(modifiedPreviewAppPath, '.next'),
        file,
      );
    }
    await fs.promises.writeFile(filesPath, JSON.stringify(filesJson), 'utf8');

    filesPath = path.join(builtPreviewAppPath, '.next/next-server.js.nft.json');
    filesJson = JSON.parse(await fs.promises.readFile(filesPath, 'utf8'));
    for (const [i, file] of filesJson.files.entries()) {
      filesJson.files[i] = path.relative(
        path.resolve(modifiedPreviewAppPath, '.next'),
        file,
      );
    }
    await fs.promises.writeFile(filesPath, JSON.stringify(filesJson), 'utf8');
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
