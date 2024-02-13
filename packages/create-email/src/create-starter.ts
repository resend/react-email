import { fileURLToPath } from "node:url";
import { promises as fs } from "node:fs";
import path from "node:path";

export interface CreateServerMatadata {
  absoluteProjectPath: string;
  enableTypeScript: boolean;
  enableTailwindCSS: boolean;
}

const updatePackageJsonToMatchFolderName = async (
  absoluteProjectPath: string,
) => {
  const packageJsonPath = path.resolve(absoluteProjectPath, "package.json");
  const packageJson = JSON.parse(await fs.readFile(packageJsonPath, "utf-8"));

  packageJson.name = path.basename(absoluteProjectPath);

  await fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2));
};

export const createStarter = async ({
  absoluteProjectPath,
  enableTypeScript,
  enableTailwindCSS,
}: CreateServerMatadata) => {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));

  let templateName;
  if (enableTypeScript && enableTailwindCSS) {
    templateName = "tailwind-and-typescript";
  } else if (!enableTypeScript && enableTailwindCSS) {
    templateName = "tailwind-and-javascript";
  } else if (enableTypeScript && !enableTailwindCSS) {
    templateName = "typescript";
  } else {
    templateName = "javascript";
  }

  const templatePath = path.resolve(__dirname, "../templates/", templateName);

  await fs.cp(templatePath, absoluteProjectPath, { recursive: true });

  await updatePackageJsonToMatchFolderName(absoluteProjectPath);

  const templatePackageJsonPath = path.resolve(
    resolvedProjectPath,
    "./package.json",
  );
  const templatePackageJson = JSON.parse(
    await fs.readFile(templatePackageJsonPath, "utf8"),
  ) as { dependencies: Record<string, string> };
  for (const key in templatePackageJson.dependencies) {
    // We remove any workspace prefix that might have been added for the purposes
    // of being used locally
    templatePackageJson.dependencies[key] = templatePackageJson.dependencies[
      key
    ].replace("workspace:", "");
  }
  await fs.writeFile(
    templatePackageJsonPath,
    JSON.stringify(templatePackageJson, null, 2),
    "utf8",
  );
};
