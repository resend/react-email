#!/usr/bin/env node

import { program } from "commander";
import logSymbols from "log-symbols";
import ora from "ora";
import treeCli from "tree-cli";
import pkg from "../package.json";
import { askUserThroughPrompts } from "./ask-user-through-prompts";
import { createStarter } from "./create-starter";

program
  .name("create-email")
  .version(pkg.version)
  .description("The easiest way to get started with React Email")
  .action(async () => {
    const { isTailwindEnabled, isTypescriptEnabled, absoluteProjectPath } =
      await askUserThroughPrompts();

    const spinner = ora("Preparing files...\n").start();

    await createStarter({
      absoluteProjectPath,
      enableTypeScript: isTypescriptEnabled,
      enableTailwindCSS: isTailwindEnabled,
    });

    const { report } = await treeCli({
      l: 4,
      base: absoluteProjectPath,
    });

    console.log(report);

    spinner.stopAndPersist({
      symbol: logSymbols.success,
      text: "React Email Starter files ready",
    });
  })
  .parse(process.argv);
