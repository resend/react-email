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
  const packageJson = JSON.parse(
    await fs.readFile(packageJsonPath, "utf-8"),
  ) as {
    name: string;
  };

  packageJson.name = path.basename(absoluteProjectPath);

  await fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2));
};

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const ignoreNodeModulesFilter = (source: string) => {
  return !source.replace(__dirname, "").includes("node_modules");
};

export const createStarter = async ({
  absoluteProjectPath,
  enableTypeScript,
  enableTailwindCSS,
}: CreateServerMatadata) => {
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

  await fs.cp(templatePath, absoluteProjectPath, {
    recursive: true,
    filter: ignoreNodeModulesFilter,
  });

  await updatePackageJsonToMatchFolderName(absoluteProjectPath);

  const templatePackageJsonPath = path.resolve(
    absoluteProjectPath,
    "./package.json",
  );
  const templatePackageJson = JSON.parse(
    await fs.readFile(templatePackageJsonPath, "utf8"),
  ) as {
    dependencies: Record<string, string>;
    devDependencies: Record<string, string>;
  };
  for (const key in templatePackageJson.dependencies) {
    templatePackageJson.dependencies[key] = templatePackageJson.dependencies[
      key
    ].replace("workspace:", "");
  }
  for (const key in templatePackageJson.devDependencies) {
    templatePackageJson.devDependencies[key] =
      templatePackageJson.devDependencies[key].replace("workspace:", "");
  }
  await fs.writeFile(
    templatePackageJsonPath,
    JSON.stringify(templatePackageJson, null, 2),
    "utf8",
  );
};
