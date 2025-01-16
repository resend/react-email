#!/usr/bin/env node

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Command } from 'commander';
import fse from 'fs-extra';
import logSymbols from 'log-symbols';
import ora from 'ora';
import { tree } from './tree.js';

const init = async (name) => {
  const spinner = ora('Preparing files...\n').start();

  let projectPath = name;

  if (!projectPath) {
    projectPath = path.join(process.cwd(), 'react-email-starter');
  }

  if (typeof projectPath === 'string') {
    projectPath = projectPath.trim();
  }

  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const templatePath = path.resolve(__dirname, '../template');
  const resolvedProjectPath = path.resolve(projectPath);

  fse.copySync(templatePath, resolvedProjectPath, {
    recursive: true,
  });
  const templatePackageJsonPath = path.resolve(
    resolvedProjectPath,
    './package.json',
  );
  const templatePackageJson = JSON.parse(
    fse.readFileSync(templatePackageJsonPath, 'utf8'),
  );
  for (const key in templatePackageJson.dependencies) {
    // We remove any workspace prefix that might have been added for the purposes
    // of being used locally
    templatePackageJson.dependencies[key] = templatePackageJson.dependencies[
      key
    ].replace('workspace:', '');
  }
  for (const key in templatePackageJson.devDependencies) {
    // We remove any workspace prefix that might have been added for the purposes
    // of being used locally
    templatePackageJson.devDependencies[key] =
      templatePackageJson.devDependencies[key].replace('workspace:', '');
  }
  fse.writeFileSync(
    templatePackageJsonPath,
    JSON.stringify(templatePackageJson, null, 2),
    'utf8',
  );

  spinner.stopAndPersist({
    symbol: logSymbols.success,
    text: 'React Email Starter files ready',
  });

  // eslint-disable-next-line no-console
  console.log(await tree('./react-email-starter', 4));
};

new Command()
  .name('create-email')
  .version('0.0.30-canary.0')
  .description('The easiest way to get started with React Email')
  .arguments('[dir]', 'path to initialize the project')
  .action(init)
  .parse(process.argv);
