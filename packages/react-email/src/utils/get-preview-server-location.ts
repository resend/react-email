import child_process from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import ora from 'ora';
import { extract } from 'tar';
import { packageJson } from './packageJson.js';
import { registerSpinnerAutostopping } from './register-spinner-autostopping.js';
import logSymbols from 'log-symbols';

export async function installPreviewServer(directory: string, version: string) {
  const spinner = ora({
    text: 'Installing UI',
    prefixText: ' ',
  });
  spinner.start();

  registerSpinnerAutostopping(spinner);
  if (fs.existsSync(directory)) {
    await fs.promises.rm(directory, { recursive: true });
  }
  await fs.promises.mkdir(directory);
  // Download and unpack the package
  const tempDir = await fs.promises.mkdtemp(
    path.join(os.tmpdir(), 'react-email-'),
  );
  try {
    // Download package using npm pack
    child_process.execSync(`npm pack @react-email/preview-server@${version}`, {
      cwd: tempDir,
      stdio: 'ignore',
    });

    // Find the downloaded tarball
    const files = await fs.promises.readdir(tempDir);
    const tarball = files.find(
      (file) =>
        file.startsWith('react-email-preview-server-') && file.endsWith('.tgz'),
    );

    if (!tarball) {
      spinner.stopAndPersist({
        symbol: logSymbols.error,
        text: 'Failed to install UI',
      });
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
      spinner.stopAndPersist({
        symbol: logSymbols.error,
        text: 'Failed to install UI',
      });
      throw new Error('Failed to extract UI package', {
        cause: exception,
      });
    }

    const packageJsonPath = path.resolve(directory, './package.json');
    await fs.promises.cp(
      packageJsonPath,
      path.resolve(directory, './package.source.json'),
    );
    const packageJson = JSON.parse(
      await fs.promises.readFile(packageJsonPath, 'utf8'),
    );
    packageJson.dependencies = {
      next: packageJson.dependencies.next,
    };
    packageJson.devDependencies = {};
    await fs.promises.writeFile(
      packageJsonPath,
      JSON.stringify(packageJson, null, 2),
      'utf8',
    );
    child_process.execSync('npm install --silent', {
      stdio: 'ignore',
      cwd: directory,
    });
  } finally {
    // Clean up temp directory
    await fs.promises.rm(tempDir, { recursive: true, force: true });
    spinner.stopAndPersist({
      symbol: logSymbols.success,
      text: 'UI installed successfully',
    });
  }
}

export async function getPreviewServerLocation() {
  const directory = path.join(os.homedir(), '.react-email');
  if (!fs.existsSync(directory)) {
    await installPreviewServer(directory, packageJson.version);
  }

  const { version } = (await import(path.join(directory, 'index.mjs'))) as {
    version: string;
  };
  if (version !== packageJson.version) {
    await installPreviewServer(directory, packageJson.version);
  }

  return directory;
}
