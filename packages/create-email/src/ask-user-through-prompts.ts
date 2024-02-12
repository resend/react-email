import path from "node:path";
import fs from "node:fs";
import prompts from "prompts";
import { getMonorepoMetadata } from "./monorepos/get-monorepo-metadata";

export const askUserThroughPrompts = async () => {
  const { relativeProjectPath } = await prompts({
    type: "text",
    initial: "react-email-starter",
    message: "What will your project be named?",
    name: "relativeProjectPath",
  });

  let baseDirectory = process.cwd();

  const monorepoMetadata = await getMonorepoMetadata(process.cwd());
  if (typeof monorepoMetadata !== "undefined") {
    const globOnlyWorkspaces = monorepoMetadata.workspaceGlobs.filter(
      (possibleGlob) =>
        !fs.existsSync(
          path.resolve(monorepoMetadata.monorepoRoot, possibleGlob),
        ),
    );
    const regex = /\*$/;
    // only globs like packages/*
    const firstDepthGlobOnlyWorkspaces = globOnlyWorkspaces.filter(
      (glob) => glob.split("*").length === 2 && regex.test(glob),
    );

    if (
      firstDepthGlobOnlyWorkspaces.length > 0
    ) {
      const { shouldAddAsWorkspaceAnswer } = await prompts({
        type: "confirm",
        initial: true,
        message: `We noticed you have a monorepo there. Would you like to add ${relativeProjectPath} as one of the workspaces?`,
        name: "shouldAddAsWorkspaceAnswer",
      });

      if (shouldAddAsWorkspaceAnswer) {
        const { globWorkspaceToAddTo } = await prompts({
          type: "select",
          choices: firstDepthGlobOnlyWorkspaces.map((glob) => ({
            title: glob,
            value: glob,
          })),
          message: "Which glob should the workspace match with?",
          name: "globWorkspaceToAddTo",
        });

        const workspacesDirectory = globWorkspaceToAddTo.split("*")[0];

        baseDirectory = path.resolve(
          monorepoMetadata.monorepoRoot,
          workspacesDirectory,
        );
      }
    }
  }

  let absoluteProjectPath = path.resolve(baseDirectory, relativeProjectPath);

  const { isTypescriptEnabled, isTailwindEnabled } = await prompts([
    {
      type: "confirm",
      initial: true,
      message: "Would you like to use TypeScript?",
      name: "isTypescriptEnabled",
    },
    {
      type: "confirm",
      initial: true,
      message: "Would you like to use Tailwind CSS?",
      name: "isTailwindEnabled",
    },
  ]);

  return {
    absoluteProjectPath,
    isTypescriptEnabled,
    isTailwindEnabled,
  };
};
