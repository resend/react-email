import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import logSymbols from 'log-symbols';
import ora from 'ora';
import type { RawSourceMap } from 'source-map-js';
import { buildEmailIntoRunnableCode } from '../../utils/build-email-into-runnable-code';
import {
  type EmailsDirectory,
  getEmailsDirectoryMetadata,
} from '../../utils/get-emails-directory-metadata';
import { registerSpinnerAutostopping } from '../../utils/register-spinner-autostopping';
import { isErr } from '../../utils/result';
import { cliPacakgeLocation } from '../utils';
import { resolveFileFromImportPath } from '../../utils/resolve-file-from-import-path';

interface Args {
  dir: string;
  packageManager: string;
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
const prebuiltEmailsLocation = path.resolve(process.cwd(), './emails');
const userProjectLocation = path.resolve(process.cwd(), '../');
/** @type {import('next').NextConfig} */
module.exports = {
  env: {
    NEXT_PUBLIC_IS_BUILDING: 'true',
    PRE_BUILT_EMAILS_LOCATION: prebuiltEmailsLocation,

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
  emailsDirectoryMetadata: EmailsDirectory,
) => {
  const parameters = getEmailSlugsFromEmailDirectory(
    emailsDirectoryMetadata,
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

  packageJson.name = 'preview-server';
  // We remove this one to avoid having resolve issues on our demo build process.
  // This is only used in the `export` command so it's irrelevant to have it here.
  //
  // See `src/actions/render-email-by-path` for more info on how we render the
  // email templates without `@react-email/render` being installed.
  delete packageJson.devDependencies['@react-email/render'];
  delete packageJson.devDependencies['@react-email/components'];
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
    const childProc = spawn(
      packageManager,
      ['install', '--silent', '--include=dev'],
      {
        cwd: builtPreviewAppPath,
        shell: true,
      },
    );
    childProc.stdout.pipe(process.stdout);
    childProc.stderr.pipe(process.stderr);
    childProc.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(
          new Error(
            `Unable to install the dependencies and it exited with code: ${code}`,
          ),
        );
      }
    });
  });
};

const getEmailMetadata = (directory: EmailsDirectory) => {
  let emailMetadatas = directory.emailFilenames.map((filename) => ({
    slug: path.join(directory.relativePath, filename).replaceAll(path.sep, '/'),
    path: path.resolve(directory.absolutePath, filename),
  }));

  for (const subDirectory of directory.subDirectories) {
    emailMetadatas = [...emailMetadatas, ...getEmailMetadata(subDirectory)];
  }

  return emailMetadatas;
};

type BuildData = Record<
  string,
  {
    emailPath: string;
    fileContents: string;
    sourceMap: RawSourceMap;
    runnableCode: string;
  }
>;

const generateBuildData = async (
  emailsDirectoryMetadata: EmailsDirectory,
  onStartBuildingTemplate?: (slug: string) => void,
): Promise<BuildData> => {
  const buildData: BuildData = {};

  const emailMetadatas = getEmailMetadata(emailsDirectoryMetadata);

  for await (const metadata of emailMetadatas) {
    onStartBuildingTemplate?.(metadata.slug);
    const buildResult = await buildEmailIntoRunnableCode(metadata.path);
    if (isErr(buildResult)) {
      console.error(buildResult.error);
      throw new Error(`Failed during build of ${metadata.slug}`);
    }

    const emailPathResult = await resolveFileFromImportPath(metadata.path);
    if (isErr(emailPathResult)) {
      throw new Error(
        `Could not resolve path for email template ${metadata.slug}`,
      );
    }
    const { value: emailPath } = emailPathResult;

    buildData[metadata.slug] = {
      emailPath,
      fileContents: await fs.promises.readFile(emailPath, 'utf8'),
      runnableCode: buildResult.value.runnableCode,
      sourceMap: buildResult.value.sourceMap,
    };
  }

  return buildData;
};

const replacePredoneBuildData = async (
  builtPreviewAppPath: string,
  buildData: BuildData,
): Promise<void> => {
  const predoneBuildDataPath = path.resolve(
    builtPreviewAppPath,
    './src/actions/predone-build-data.ts',
  );
  const escapedJson = JSON.stringify(buildData, null, 2)
    .replaceAll('\\', '\\\\')
    .replaceAll('`', '\\`')
    .replaceAll('${', '\\${');
  await fs.promises.writeFile(
    predoneBuildDataPath,
    `export const predoneBuildDataJson = \`${escapedJson}\`\n`,
    'utf8',
  );
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
    registerSpinnerAutostopping(spinner);

    spinner.text = `Checking if ${emailsDirRelativePath} folder exists`;
    if (!fs.existsSync(emailsDirRelativePath)) {
      process.exit(1);
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
          !/(\/|\\)cli(\/|\\)?/.test(source) &&
          !/(\/|\\)\.next(\/|\\)?/.test(source) &&
          !/(\/|\\)\.turbo(\/|\\)?/.test(source) &&
          !/(\/|\\)node_modules(\/|\\)?$/.test(source) &&
          !/\.spec.*$/.test(source)
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

    const emailDirectoryMetadata =
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      (await getEmailsDirectoryMetadata(emailsDirPath))!;

    spinner.text = 'Prebuilding email templates for rendering...';
    const predoneBuildData = await generateBuildData(
      emailDirectoryMetadata,
      (slug) => {
        spinner.text = `Prebuilding email templates for rendering... (${slug})`;
      },
    );

    spinner.text = 'Injecting prebuilt email templates into preview app';
    await replacePredoneBuildData(builtPreviewAppPath, predoneBuildData);

    spinner.text =
      'Setting Next environment variables for preview app to work properly';
    await setNextEnvironmentVariablesForBuild(
      emailsDirRelativePath,
      builtPreviewAppPath,
    );

    spinner.text = 'Setting server side generation for the email preview pages';
    await forceSSGForEmailPreviews(
      emailsDirPath,
      builtPreviewAppPath,
      emailDirectoryMetadata,
    );

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
