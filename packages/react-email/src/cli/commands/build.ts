import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import type { EmailsDirectory } from '../../utils/actions/get-emails-directory-metadata';
import { getEmailsDirectoryMetadata } from '../../utils/actions/get-emails-directory-metadata';
import { cliPacakgeLocation } from '../utils';
import { getEnvVariablesForPreviewApp } from '../utils/preview/get-env-variables-for-preview-app';

interface Args {
  dir: string;
  port: string;
}

const buildPreviewApp = (absoluteDirectory: string) => {
  return new Promise<void>((resolve, reject) => {
    const nextBuild = spawn('npm', ['run', 'build'], {
      cwd: absoluteDirectory,
    });

    nextBuild.stdout.on('data', (msg: Buffer) => {
      process.stderr.write(msg);
    });
    nextBuild.stderr.on('data', (msg: Buffer) => {
      process.stdout.write(msg);
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
  builtPreviewAppPath: string,
) => {
  const envVariables = {
    ...getEnvVariablesForPreviewApp('emails', 'PLACEHOLDER', 'PLACEHOLDER'),
    NEXT_PUBLIC_DISABLE_HOT_RELOADING: 'true',
  };

  const nextConfigContents = `/** @type {import('next').NextConfig} */
module.exports = {
  env: {
    ...${JSON.stringify(envVariables)},
    NEXT_PUBLIC_USER_PROJECT_LOCATION: process.cwd(),
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
    serverComponentsExternalPackages: [
      '@react-email/components',
      '@react-email/render',
      '@react-email/tailwind',
    ],
  },
  transpilePackages: [
    '@react-email/components',
    '@react-email/render',
    '@react-email/tailwind',
  ],
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

  const slugs = [] as string[];
  emailDirectory.emailFilenames.forEach((filename) =>
    slugs.push(path.join(directoryPathRelativeToEmailsDirectory, filename)),
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
  // const parameters = [];

  await fs.promises.appendFile(
    path.resolve(builtPreviewAppPath, './src/app/preview/[slug]/page.tsx'),
    `

export async function generateStaticParams() { 
  return ${JSON.stringify(parameters)};
}`,
    'utf8',
  );
};

const updatePackageJsonBuild = async (builtPreviewAppPath: string) => {
  const packageJsonPath = path.resolve(builtPreviewAppPath, './package.json');
  const packageJson = JSON.parse(
    await fs.promises.readFile(packageJsonPath, 'utf8'),
  ) as { scripts: { build: string } };
  packageJson.scripts.build = 'next build';
  await fs.promises.writeFile(
    packageJsonPath,
    JSON.stringify(packageJson),
    'utf8',
  );
};

export const build = async ({ dir: emailsDirRelativePath }: Args) => {
  try {
    if (!fs.existsSync(emailsDirRelativePath)) {
      throw new Error(`Missing ${emailsDirRelativePath} folder`);
    }

    const emailsDirPath = path.join(process.cwd(), emailsDirRelativePath);
    const staticPath = path.join(process.cwd(), 'emails', 'static');

    const builtPreviewAppPath = path.join(process.cwd(), '.react-email');

    if (fs.existsSync(builtPreviewAppPath)) {
      await fs.promises.rm(builtPreviewAppPath, { recursive: true });
    }

    // this should also come with the node_modules so there's no need to install it again
    await fs.promises.cp(cliPacakgeLocation, builtPreviewAppPath, {
      recursive: true,
      filter: (source: string) => {
        // do not copy the CLI files
        return !source.includes('/cli/') && !source.includes('/.next/');
      },
    });
    const builtEmailsDirectory = path.join(builtPreviewAppPath, 'emails');
    await fs.promises.cp(emailsDirPath, builtEmailsDirectory, {
      recursive: true,
    });
    const builtStaticDirectory = path.resolve(
      builtPreviewAppPath,
      './public/static',
    );
    await fs.promises.cp(staticPath, builtStaticDirectory, { recursive: true });

    await setNextEnvironmentVariablesForBuild(builtPreviewAppPath);

    await forceSSGForEmailPreviews(emailsDirPath, builtPreviewAppPath);

    await updatePackageJsonBuild(builtPreviewAppPath);

    await buildPreviewApp(builtPreviewAppPath);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
