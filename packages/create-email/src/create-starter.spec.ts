import path from "node:path";
import fs, { promises } from "node:fs";
import type { SpyInstance } from "vitest";
import { createStarter, ignoreNodeModulesFilter } from "./create-starter";

describe("createStarter tests per template type", () => {
  const testingTemporaryFolderPath = path.resolve(
    __dirname,
    "../.testing-temp",
  );
  let copySpy: SpyInstance<
    [
      source: string | URL,
      destination: string | URL,
      opts?: fs.CopyOptions | undefined,
    ],
    Promise<void>
  >;

  beforeEach(() => {
    copySpy = vi.spyOn(promises, "cp");
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test("create-email behavior on the template for typescript + tailwind", async () => {
    await createStarter({
      absoluteProjectPath: testingTemporaryFolderPath,
      enableTailwindCSS: true,
      enableTypeScript: true,
    });

    expect(fs.existsSync(testingTemporaryFolderPath)).toBe(true);
    expect(copySpy).toHaveBeenLastCalledWith(
      path.resolve(__dirname, "../templates/tailwind-and-typescript"),
      testingTemporaryFolderPath,
      {
        recursive: true,
        filter: ignoreNodeModulesFilter,
      },
    );
  });

  test("create-email behavior on the template for javascript + tailwind", async () => {
    await createStarter({
      absoluteProjectPath: testingTemporaryFolderPath,
      enableTailwindCSS: true,
      enableTypeScript: false,
    });

    expect(fs.existsSync(testingTemporaryFolderPath)).toBe(true);
    expect(copySpy).toHaveBeenLastCalledWith(
      path.resolve(__dirname, "../templates/tailwind-and-javascript"),
      testingTemporaryFolderPath,
      {
        recursive: true,
        filter: ignoreNodeModulesFilter,
      },
    );
  });

  test("create-email behavior on the template for just javascript", async () => {
    await createStarter({
      absoluteProjectPath: testingTemporaryFolderPath,
      enableTailwindCSS: false,
      enableTypeScript: false,
    });

    expect(fs.existsSync(testingTemporaryFolderPath)).toBe(true);
    expect(copySpy).toHaveBeenLastCalledWith(
      path.resolve(__dirname, "../templates/javascript"),
      testingTemporaryFolderPath,
      {
        recursive: true,
        filter: ignoreNodeModulesFilter,
      },
    );
  });

  test("create-email behavior on the template for just typescript", async () => {
    await createStarter({
      absoluteProjectPath: testingTemporaryFolderPath,
      enableTailwindCSS: false,
      enableTypeScript: true,
    });

    expect(fs.existsSync(testingTemporaryFolderPath)).toBe(true);
    expect(copySpy).toHaveBeenLastCalledWith(
      path.resolve(__dirname, "../templates/typescript"),
      testingTemporaryFolderPath,
      {
        recursive: true,
        filter: ignoreNodeModulesFilter,
      },
    );
  });
});
