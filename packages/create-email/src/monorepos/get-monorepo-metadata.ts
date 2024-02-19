import fs from "node:fs";
import path from "node:path";
import { parse } from "yaml";
import { findMonorepoRoot } from "./find-monorepo-root";

const getMonorepoWorkspaceGlobs = async (monorepoRoot: string) => {
  let workspaceGlobs: string[] | undefined | null;
  if (fs.existsSync(path.resolve(monorepoRoot, "./pnpm-workspace.yaml"))) {
    // if this is a pnpm workspace

    const pnpmWorkspaceYaml = fs.readFileSync(
      path.resolve(monorepoRoot, "./pnpm-workspace.yaml"),
      "utf8",
    );
    workspaceGlobs = (
      parse(pnpmWorkspaceYaml) as { packages: string[] | undefined | null }
    ).packages;

    if (
      typeof workspaceGlobs === "undefined" ||
      !Array.isArray(workspaceGlobs)
    ) {
      throw new Error(
        'The place where the workspaces were expected to be in, i.e. the "packages" field of the pnpm-worksapce.yaml file, was not found.',
        {
          cause: {
            pnpmWorkspaceYaml,
            monorepoRoot,
          },
        },
      );
    }
  } else {
    // if this is a npm, yarn or bun workspace
    const packageJson = JSON.parse(
      await fs.promises.readFile(
        path.join(monorepoRoot, "package.json"),
        "utf8",
      ),
    ) as {
      workspaces?: string[];
    };

    workspaceGlobs = packageJson.workspaces;

    if (
      typeof workspaceGlobs === "undefined" ||
      !Array.isArray(workspaceGlobs)
    ) {
      throw new Error(
        'The place where the workspaces were expected to be in, i.e. the "workspaces" field of the package.json file, was not found.',
        {
          cause: {
            packageJson,
            monorepoRoot,
          },
        },
      );
    }
  }

  return workspaceGlobs;
};

export const getMonorepoMetadata = async (
  absolutePathToFileOrDirectory: string,
) => {
  const monorepoRoot = await findMonorepoRoot(absolutePathToFileOrDirectory);

  if (typeof monorepoRoot === "undefined") {
    return;
  }

  const workspaceGlobs = await getMonorepoWorkspaceGlobs(monorepoRoot);

  return {
    monorepoRoot,
    workspaceGlobs,
  };
};
