import { fileURLToPath } from "node:url";
import { promises as fs } from "node:fs";
import path from "node:path";

export const createStarter = async (absoluteProjectPath: string) => {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const templatePath = path.resolve(__dirname, "../template");
  const resolvedProjectPath = path.resolve(absoluteProjectPath);

  await fs.cp(templatePath, resolvedProjectPath, { recursive: true });

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
