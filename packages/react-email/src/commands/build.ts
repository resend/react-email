import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import logSymbols from 'log-symbols';
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

const buildPreviewApp = (absoluteDirectory: string) => {
  return new Promise<void>((resolve, reject) => {
    const nextBuild = spawn('npm', ['run', 'build'], {
      cwd: absoluteDirectory,
      shell: true,
    });
    nextBuild.stdout.pipe(process.stdout);
    nextBuild.stderr.pipe(process.stderr);

    nextBuild.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(
          new Error(
            `Unable to build the Next app and it exited with code: ${code}`,
          ),
        );
      }
    });
  });
};

const setNextEnvironmentVariablesForBuild = async (
  emailsDirRelativePath: string,
  builtPreviewAppPath: string,
) => {
  const nextConfigContents = `
const path = require('path');
const emailsDirRelativePath = path.normalize('${emailsDirRelativePath}');
const userProjectLocation = '${process.cwd()}';
/** @type {import('next').NextConfig} */
module.exports = {
  env: {
    NEXT_PUBLIC_IS_BUILDING: 'true',
    EMAILS_DIR_RELATIVE_PATH: emailsDirRelativePath,
    EMAILS_DIR_ABSOLUTE_PATH: path.resolve(userProjectLocation, emailsDirRelativePath),
    USER_PROJECT_LOCATION: userProjectLocation
  },
  // this is needed so that the code for building emails works properly
  webpack: (
    /** @type {import('webpack').Configuration & { externals: string[] }} */
    config,
    { isServer }
  ) => {
    if (isServer) {
      config.externals.push('esbuild');
    }

    return config;
  },
  typescript: {
    ignoreBuildErrors: true
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  experimental: {
    webpackBuildWorker: true
  },
}`;

  await fs.promises.writeFile(
    path.resolve(builtPreviewAppPath, './next.config.js'),
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
  emailDirectory.emailFilenames.forEach((filename) =>
    slugs.push(
      path
        .join(directoryPathRelativeToEmailsDirectory, filename)
        .split(path.sep)
        // sometimes it gets empty segments due to trailing slashes
        .filter((segment) => segment.length > 0),
    ),
  );
  emailDirectory.subDirectories.forEach((directory) => {
    slugs.push(
      ...getEmailSlugsFromEmailDirectory(
        directory,
        emailsDirectoryAbsolutePath,
      ),
    );
  });

  return slugs;
};

// we do this because otherwise it won't be able to find the emails
// after build
const forceSSGForEmailPreviews = async (
  emailsDirPath: string,
  builtPreviewAppPath: string,
) => {
  const emailDirectoryMetadata =
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    (await getEmailsDirectoryMetadata(emailsDirPath))!;

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
  packageJson.scripts.build = 'next build';
  packageJson.scripts.start = 'next start';
  delete packageJson.scripts.postbuild;

  packageJson.name = 'preview-server';

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
      'The packageManager option is deprecated and will be removed in the next major version, in this version it does not have any effect.',
    );
  }

  try {
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

    const builtPreviewAppPath = path.join(process.cwd(), '.react-email');

    if (fs.existsSync(builtPreviewAppPath)) {
      spinner.text = 'Deleting pre-existing built folder';
      await fs.promises.rm(builtPreviewAppPath, { recursive: true });
    }

    const modifiedPreviewServerPath = path.resolve(
      path.dirname(previewServerLocation),
      '.react-email',
    );

    if (fs.existsSync(modifiedPreviewServerPath)) {
      spinner.text = 'Deleting pre-existing modified preview server folder';
      await fs.promises.rm(modifiedPreviewServerPath, { recursive: true });
    }

    spinner.text = 'Copying preview server';
    await fs.promises.cp(previewServerLocation, modifiedPreviewServerPath, {
      recursive: true,
      filter: (source: string) => {
        return (
          !/(\/|\\)\.next(\/|\\)?/.test(source) &&
          !/(\/|\\)\.turbo(\/|\\)?/.test(source)
        );
      },
    });

    if (fs.existsSync(staticPath)) {
      spinner.text =
        'Copying `static` folder into `.react-email/public/static`';
      const modifiedPreviewServerStaticDirectory = path.resolve(
        modifiedPreviewServerPath,
        './public/static',
      );
      await fs.promises.cp(staticPath, modifiedPreviewServerStaticDirectory, {
        recursive: true,
      });
    }

    spinner.text =
      'Setting Next environment variables for preview server to work properly';
    await setNextEnvironmentVariablesForBuild(
      emailsDirRelativePath,
      modifiedPreviewServerPath,
    );

    spinner.text = 'Setting server side generation for the email preview pages';
    await forceSSGForEmailPreviews(emailsDirPath, modifiedPreviewServerPath);

    spinner.text = "Updating package.json's build and start scripts";
    await updatePackageJson(modifiedPreviewServerPath);

    spinner.stopAndPersist({
      text: 'Successfully prepared `.react-email` for `next build`',
      symbol: logSymbols.success,
    });

    await buildPreviewApp(modifiedPreviewServerPath);

    await fs.promises.mkdir(builtPreviewAppPath);

    await fs.promises.cp(
      path.join(modifiedPreviewServerPath, '.next'),
      path.join(builtPreviewAppPath, '.next'),
      {
        recursive: true,
      },
    );

    await fs.promises.rmdir(modifiedPreviewServerPath, { recursive: true });
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
