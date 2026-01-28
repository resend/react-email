import child_process from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import url from 'node:url';
import { getPackages } from '@manypkg/get-packages';
import logSymbols from 'log-symbols';
import { installDependencies } from 'nypm';
import ora from 'ora';
import { extract } from 'tar';
import { packageJson } from './packageJson.js';
import { registerSpinnerAutostopping } from './register-spinner-autostopping.js';

/**
 * This is only true in the React Email monorepo, and is meant to improve the DX on our side without affect user's DX.
 */
export const isInMonorepo = !import.meta.dirname.includes('node_modules');

export async function installPreviewServer(directory: string, version: string) {
  const spinner = ora({
    text: 'Installing UI',
    prefixText: ' ',
  });
  spinner.start();

  registerSpinnerAutostopping(spinner);
  if (fs.existsSync(directory)) {
    spinner.text = 'Deleting previous installation, please wait...';
    await fs.promises.rm(directory, { recursive: true });
  }
  await fs.promises.mkdir(directory);

  const tempDir = await fs.promises.mkdtemp(
    path.join(os.tmpdir(), 'react-email-'),
  );
  try {
    child_process.execSync(`npm pack @react-email/preview-server@${version}`, {
      cwd: tempDir,
      stdio: 'pipe',
    });

    const files = await fs.promises.readdir(tempDir);
    const tarball = files.find(
      (file) =>
        file.startsWith('react-email-preview-server-') && file.endsWith('.tgz'),
    );

    if (!tarball) {
      throw new Error('Failed to find tarball for UI', {
        cause: { tempDir, files },
      });
    }

    // Extract tarball to directory using tar package
    const tarballPath = path.join(tempDir, tarball);
    try {
      await extract({
        cwd: directory,
        strip: 1,
        file: tarballPath,
        z: true,
      });
    } catch (exception) {
      throw new Error('Failed to extract UI package', {
        cause: exception,
      });
    }

    await installDependencies({
      packageManager: 'npm',
      cwd: directory,
      silent: true,
    });
  } catch (exception) {
    spinner.stopAndPersist({
      symbol: logSymbols.error,
      text: 'Failed to install UI',
    });
    throw exception;
  } finally {
    // Clean up temp directory
    await fs.promises.rm(tempDir, { recursive: true, force: true });
  }

  spinner.stopAndPersist({
    symbol: logSymbols.success,
    text: `UI installed successfully (${directory})\n`,
  });
}

export async function getPreviewServerLocation() {
  if (isInMonorepo) {
    const { packages } = await getPackages(process.cwd());
    for (const pkg of packages) {
      if (pkg.packageJson.name === '@react-email/preview-server') {
        return pkg.dir;
      }
    }
    throw new Error(
      "Couldn't find the preview server package in the monorepo. Is this not React Email's monorepo, or is the package missing?",
    );
  }

  const directory = path.join(os.homedir(), '.react-email');
  if (!fs.existsSync(directory)) {
    await installPreviewServer(directory, packageJson.version);
  }

  let version: string;
  const indexUrl = url.pathToFileURL(path.join(directory, 'index.mjs')).href;
  try {
    ({ version } = (await import(indexUrl)) as {
      version: string;
    });
  } catch {
    console.warn('UI installation seems broken, reinstalling');
    await installPreviewServer(directory, packageJson.version);
    ({ version } = (await import(indexUrl)) as {
      version: string;
    });
  }
  if (version !== packageJson.version) {
    console.warn(
      'Found a version mismatch with the preview server UI, reinstalling',
    );
    await installPreviewServer(directory, packageJson.version);
  }

  return directory;
}
