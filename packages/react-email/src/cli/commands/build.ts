import fs from 'node:fs';
import path from 'node:path';
import ora from 'ora';
import shell from 'shelljs';
import { spawn } from 'node:child_process';
import {
  type EmailsDirectory,
  getEmailsDirectoryMetadata,
} from '../../actions/get-emails-directory-metadata';
import { cliPacakgeLocation } from '../utils';
import { getEnvVariablesForPreviewApp } from '../utils/preview/get-env-variables-for-preview-app';
import { closeOraOnSIGNIT } from '../utils/close-ora-on-sigint';
import logSymbols from 'log-symbols';

interface Args {
  dir: string;
  packageManager: string;
}

const buildPreviewApp = (absoluteDirectory: string) => {
  return new Promise<void>((resolve, reject) => {
    const nextBuild = spawn('npm', ['run', 'build'], {
      cwd: absoluteDirectory,
    });

    nextBuild.stdout.on('data', (msg: Buffer) => {
      process.stdout.write(msg);
    });
    nextBuild.stderr.on('data', (msg: Buffer) => {
      process.stderr.write(msg);
    });

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
  const envVariables = {
    ...getEnvVariablesForPreviewApp(
      emailsDirRelativePath,
      'PLACEHOLDER',
      'PLACEHOLDER',
    ),
    NEXT_PUBLIC_IS_BUILDING: 'true',
  };

  const nextConfigContents = `
const path = require('path');
/** @type {import('next').NextConfig} */
module.exports = {
  env: {
    ...${JSON.stringify(envVariables)},
    NEXT_PUBLIC_USER_PROJECT_LOCATION: path.resolve(process.cwd(), '../'),
    NEXT_PUBLIC_CLI_PACKAGE_LOCATION: process.cwd(),
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
    webpackBuildWorker: true,
    serverComponentsExternalPackages: [
      '@react-email/components',
      '@react-email/render',
      '@react-email/tailwind',
    ],
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

  await fs.promises.appendFile(
    path.resolve(builtPreviewAppPath, './src/app/preview/[...slug]/page.tsx'),
    `

export async function generateStaticParams() { 
  return ${JSON.stringify(parameters)};
}`,
    'utf8',
  );
};

const updatePackageJson = async (builtPreviewAppPath: string) => {
  const packageJsonPath = path.resolve(builtPreviewAppPath, './package.json');
  const packageJson = JSON.parse(
    await fs.promises.readFile(packageJsonPath, 'utf8'),
  ) as {
    scripts: Record<string, string>;
    dependencies: Record<string, string>;
  };
  packageJson.scripts.build = 'next build';
  packageJson.scripts.start = 'next start';

  packageJson.dependencies.sharp = '0.33.2';
  await fs.promises.writeFile(
    packageJsonPath,
    JSON.stringify(packageJson),
    'utf8',
  );
};

const npmInstall = async (
  builtPreviewAppPath: string,
  packageManager: string,
) => {
  return new Promise<void>((resolve, reject) => {
    shell.exec(
      `${packageManager} install --silent`,
      { cwd: builtPreviewAppPath },
      (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(
            new Error(
              `Unable to install the dependencies and it exited with code: ${code}`,
            ),
          );
        }
      },
    );
  });
};

export const build = async ({
  dir: emailsDirRelativePath,
  packageManager,
}: Args) => {
  try {
    const spinner = ora({
      text: 'Starting build process...',
      prefixText: '  ',
    }).start();
    closeOraOnSIGNIT(spinner);

    spinner.text = 'Checking if emails folder exists';
    if (!fs.existsSync(emailsDirRelativePath)) {
      throw new Error(`Missing ${emailsDirRelativePath} folder`);
    }

    const emailsDirPath = path.join(process.cwd(), emailsDirRelativePath);
    const staticPath = path.join(emailsDirPath, 'static');

    const builtPreviewAppPath = path.join(process.cwd(), '.react-email');

    if (fs.existsSync(builtPreviewAppPath)) {
      spinner.text = 'Deleting pre-existing `.react-email` folder';
      await fs.promises.rm(builtPreviewAppPath, { recursive: true });
    }

    spinner.text = 'Copying preview app from CLI to `.react-email`';
    await fs.promises.cp(cliPacakgeLocation, builtPreviewAppPath, {
      recursive: true,
      filter: (source: string) => {
        // do not copy the CLI files
        return (
          !source.includes('/cli/') &&
          !source.includes('/.next/') &&
          !/\/node_modules\/?$/.test(source)
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
    );

    spinner.text = 'Setting server side generation for the email preview pages';
    await forceSSGForEmailPreviews(emailsDirPath, builtPreviewAppPath);

    spinner.text = "Updating package.json's build and start scripts";
    await updatePackageJson(builtPreviewAppPath);

    spinner.text = 'Installing dependencies on `.react-email`';
    await npmInstall(builtPreviewAppPath, packageManager);

    spinner.stopAndPersist({
      text: 'Successfully prepared `.react-email` for `next build`',
      symbol: logSymbols.success,
    });

    await buildPreviewApp(builtPreviewAppPath);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
