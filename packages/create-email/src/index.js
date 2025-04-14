#!/usr/bin/env node

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Command } from 'commander';
import fse from 'fs-extra';
import logSymbols from 'log-symbols';
import ora from 'ora';
import { tree } from './tree.js';

const getLatestVersionOfTag = async (packageName, tag) => {
  const response = await fetch(
    `https://registry.npmjs.org/${packageName}/${tag}`,
  );
  const data = await response.json();
  if (typeof data === 'string' && data.startsWith('version not found')) {
    console.error(`Tag ${tag} does not exist for ${packageName}.`);
    process.exit(1);
  }
  return data.version;
};

const init = async (name, { tag }) => {
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

  if (fse.existsSync(resolvedProjectPath)) {
    console.error(`Project called ${projectPath} already exists!`);
    process.exit(1);
  }

  const spinner = ora({
    text: 'Preparing files...\n',
  }).start();

  fse.copySync(templatePath, resolvedProjectPath, {
    recursive: true,
  });
  const templatePackageJsonPath = path.resolve(
    resolvedProjectPath,
    './package.json',
  );
  const templatePackageJson = fse.readFileSync(templatePackageJsonPath, 'utf8');
  fse.writeFileSync(
    templatePackageJsonPath,
    templatePackageJson
      .replace(
        'INSERT_COMPONENTS_VERSION',
        await getLatestVersionOfTag('@react-email/components', tag),
      )
      .replace(
        'INSERT_REACT_EMAIL_VERSION',
        await getLatestVersionOfTag('react-email', tag),
      ),
    'utf8',
  );

  spinner.stopAndPersist({
    symbol: logSymbols.success,
    text: 'React Email Starter files ready',
  });

  // eslint-disable-next-line no-console
  console.info(
    await tree(resolvedProjectPath, 4, (dirent) => {
      return !path
        .join(dirent.parentPath, dirent.name)
        .includes('node_modules');
    }),
  );
};

new Command()
  .name('create-email')
  .version('0.0.30-canary.0')
  .description('The easiest way to get started with React Email')
  .arguments('[dir]', 'Path to initialize the project')
  .option('-t, --tag <tag>', 'Tag of React Email versions to use', 'latest')
  .action(init)
  .parse(process.argv);
