import path from "node:path";
import prompts from "prompts";
import { getMonorepoMetadata } from "./monorepos/get-monorepo-metadata";
import { isGlob } from "./globs/is-glob";
import { isFirstDepthGlob } from "./globs/is-first-depth-glob";

export const askUserThroughPrompts = async () => {
  const { relativeProjectPath } = (await prompts(
    {
      type: "text",
      initial: "react-email-starter",
      message: "What will your project be named?",
      name: "relativeProjectPath",
    },
    { onCancel: () => process.exit(0) },
  )) as { relativeProjectPath: string };

  let baseDirectory = process.cwd();

  const monorepoMetadata = await getMonorepoMetadata(process.cwd());
  if (typeof monorepoMetadata !== "undefined") {
    const globOnlyWorkspaces = monorepoMetadata.workspaceGlobs.filter(isGlob);

    // only globs like packages/*
    const firstDepthGlobOnlyWorkspaces =
      globOnlyWorkspaces.filter(isFirstDepthGlob);

    if (firstDepthGlobOnlyWorkspaces.length > 0) {
      const { shouldAddAsWorkspaceAnswer } = (await prompts(
        {
          type: "confirm",
          initial: true,
          message: `We noticed you have a monorepo there. Would you like to add ${relativeProjectPath} as one of the workspaces?`,
          name: "shouldAddAsWorkspaceAnswer",
        },
        {
          onCancel: () => process.exit(0),
        },
      )) as { shouldAddAsWorkspaceAnswer: boolean };

      if (shouldAddAsWorkspaceAnswer) {
        const { globWorkspaceToAddTo } = (await prompts({
          type: "select",
          choices: firstDepthGlobOnlyWorkspaces.map((glob) => ({
            title: glob,
            value: glob,
          })),
          message: "Which glob should the workspace match with?",
          name: "globWorkspaceToAddTo",
        })) as { globWorkspaceToAddTo: string };

        const workspacesDirectory = globWorkspaceToAddTo.split("*")[0];

        baseDirectory = path.resolve(
          monorepoMetadata.monorepoRoot,
          workspacesDirectory,
        );
      }
    }
  }

  const absoluteProjectPath = path.resolve(baseDirectory, relativeProjectPath);

  const { isTypescriptEnabled, isTailwindEnabled } = (await prompts(
    [
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
    ],
    {
      onCancel: () => process.exit(0),
    },
  )) as { isTypescriptEnabled: boolean; isTailwindEnabled: boolean };

  return {
    absoluteProjectPath,
    isTypescriptEnabled,
    isTailwindEnabled,
  };
};
