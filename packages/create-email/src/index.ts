#!/usr/bin/env node

import { fileURLToPath } from "node:url";
import path from "node:path";
import { Argument, program } from "@commander-js/extra-typings";
import fse from "fs-extra";
import logSymbols from "log-symbols";
import ora from "ora";
import { tree } from "./tree";

program
  .name("create-email")
  .version("0.0.19")
  .description("The easiest way to get started with React Email")
  .addArgument(new Argument("dir", "path to initialize the project")
    .default("react-email-starter"))
  .action(async (relativeProjectPath) => {
    const spinner = ora("Preparing files...\n").start();

    const projectPath = path.resolve(process.cwd(), relativeProjectPath).trim();

    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const templatePath = path.resolve(__dirname, "../template");
    const resolvedProjectPath = path.resolve(projectPath);

    await fse.copy(templatePath, resolvedProjectPath);

    const templatePackageJsonPath = path.resolve(
      resolvedProjectPath,
      "./package.json",
    );
    const templatePackageJson = JSON.parse(
      fse.readFileSync(templatePackageJsonPath, "utf8"),
    ) as { dependencies: Record<string, string> };
    for (const key in templatePackageJson.dependencies) {
      // We remove any workspace prefix that might have been added for the purposes
      // of being used locally
      templatePackageJson.dependencies[key] = templatePackageJson.dependencies[
        key
      ].replace("workspace:", "");
    }
    fse.writeFileSync(
      templatePackageJsonPath,
      JSON.stringify(templatePackageJson, null, 2),
      "utf8",
    );

    // eslint-disable-next-line no-console
    console.log(await tree(relativeProjectPath, 4));

    spinner.stopAndPersist({
      symbol: logSymbols.success,
      text: "React Email Starter files ready",
    });
  })
  .parse(process.argv);
