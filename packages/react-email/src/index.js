#!/usr/bin/env node

const { Command } = require('commander');
const copy = require('copy');
const path = require('path');
const shell = require('shelljs');
const packageJson = require('../package.json');

const program = new Command();

program
  .name(packageJson.name)
  .version(packageJson.version)
  .description(packageJson.description);

const dev = () => {
  const currentPath = `${process.cwd()}/*.tsx`;
  const basePath = path.resolve(__dirname, '../base/emails');
  
  copy(currentPath, basePath, () => {
    shell.cd(path.join(__dirname, '../base'));
    shell.exec('npm run dev', { async: true });
  });
}

program
  .command('dev')
  .action(dev)

program.parse(process.argv);