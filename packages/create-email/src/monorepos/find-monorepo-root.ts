import fs from "node:fs/promises";
import path from "node:path";
import { findUp } from "find-up";

const isAMonorepo = async (absolutePathToProjectDirectory: string) => {
  const files = await fs.readdir(absolutePathToProjectDirectory, {
    recursive: false,
  });

  // for pnpm
  if (files.includes("pnpm-workspace.yaml")) {
    return true;
  }

  if (!files.includes("package.json")) {
    return false;
  }

  const packageJson = JSON.parse(
    await fs.readFile(
      path.resolve(absolutePathToProjectDirectory, "package.json"),
      "utf8",
    ),
  ) as {
    workspaces?: string[];
  };

  // for bun, yarn and npm itself
  return "workspaces" in packageJson;
};

export const findMonorepoRoot = async (
  absolutePathToFileOrDirectory: string,
): Promise<string | undefined> => {
  const pathStat = await fs.stat(absolutePathToFileOrDirectory);
  if (pathStat.isFile()) {
    return findMonorepoRoot(path.dirname(absolutePathToFileOrDirectory));
  }

  // is always a directory because of the code above 👆🏻
  const absolutPathToDirectory = absolutePathToFileOrDirectory;

  return findUp(
    async (directory) =>
      (await isAMonorepo(directory)) ? directory : undefined,
    {
      cwd: absolutPathToDirectory,
      type: "directory",
    },
  );
};
