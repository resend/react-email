#!/usr/bin/env node

const { Command } = require('commander');
const path = require('path');
const fse = require('fs-extra');
const packageJson = require('../package.json');

const init = (name) => {
  let projectPath = name;

  
  if (!projectPath) {
    projectPath = path.join(process.cwd(), 'emails');
  }
  
  
  if (typeof projectPath === 'string') {
    projectPath = projectPath.trim()
  }

  const templatePath = path.resolve(__dirname, '../template');
  const resolvedProjectPath = path.resolve(projectPath);

  fse.copySync(templatePath, resolvedProjectPath, { recursive: true });
}

const program = new Command()
  .name(packageJson.name)
  .version(packageJson.version)
  .description(packageJson.description)
  .arguments('[dir]', 'path to initiliaze the project')
  .action(init)
  .parse(process.argv);