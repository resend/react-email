import child_process from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import logSymbols from 'log-symbols';
import { installDependencies } from 'nypm';
import ora from 'ora';
import { extract } from 'tar';
import { packageJson } from './packageJson.js';
import { registerSpinnerAutostopping } from './register-spinner-autostopping.js';

export async function installPreviewServer(directory: string, version: string) {
  const spinner = ora({
    text: 'Installing UI',
    prefixText: ' ',
  });
  spinner.start();

  registerSpinnerAutostopping(spinner);
  if (fs.existsSync(directory)) {
    spinner.text = 'Deleting previous instalaltion, please wait...';
    await fs.promises.rm(directory, { recursive: true });
  }
  await fs.promises.mkdir(directory);
  // Download and unpack the package
  const tempDir = await fs.promises.mkdtemp(
    path.join(os.tmpdir(), 'react-email-'),
  );
  try {
    // Download package using npm pack
    const npmPack = child_process.execSync(
      `npm pack @react-email/preview-server@${version}`,
      {
        cwd: tempDir,
        stdio: 'pipe',
      },
    );
    if (npmPack.toString().startsWith('npm error code ETARGET')) {
      throw new Error(
        "TODO: this most likely means we're running things in our workspace, load the preview server from the workspace somehow",
      );
    }

    // Find the downloaded tarball
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
  if (!import.meta.dirname.includes('node_modules')) {
  }
  const directory = path.join(os.homedir(), '.react-email');
  if (!fs.existsSync(directory)) {
    await installPreviewServer(directory, packageJson.version);
  }

  let version: string;
  try {
    ({ version } = (await import(path.join(directory, 'index.mjs'))) as {
      version: string;
    });
  } catch {
    console.warn('UI installation seems broken, reinstalling');
    await installPreviewServer(directory, packageJson.version);
    ({ version } = (await import(path.join(directory, 'index.mjs'))) as {
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
