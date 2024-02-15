#!/usr/bin/env node

import { Command } from "commander";
import { fileURLToPath } from "node:url";
import fse from "fs-extra";
import logSymbols from "log-symbols";
import { tree } from "./tree.js";
import ora from "ora";
import path from "node:path";

const init = async (name) => {
  const spinner = ora("Preparing files...\n").start();

  let projectPath = name;

  if (!projectPath) {
    projectPath = path.join(process.cwd(), "react-email-starter");
  }

  if (typeof projectPath === "string") {
    projectPath = projectPath.trim();
  }

  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const templatePath = path.resolve(__dirname, "../template");
  const resolvedProjectPath = path.resolve(projectPath);

  fse.copySync(templatePath, resolvedProjectPath, { recursive: true });

  spinner.stopAndPersist({
    symbol: logSymbols.success,
    text: "React Email Starter files ready",
  });

  console.log(await tree("./react-email-starter", 4));
};

new Command()
  .name("create-email")
  .version("0.0.19")
  .description("The easiest way to get started with React Email")
  .arguments("[dir]", "path to initialize the project")
  .action(init)
  .parse(process.argv);
