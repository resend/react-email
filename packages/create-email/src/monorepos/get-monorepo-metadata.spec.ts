import { getMonorepoMetadata } from "./get-monorepo-metadata";

describe("tests with pnpm", () => {
  test("should return the right workspaces", async () => {
    const meta = await getMonorepoMetadata(__dirname);

    expect(meta).toBeDefined();

    if (typeof meta !== "undefined") {
      expect(meta.workspaces).toEqual([
        "apps/web",
        "packages/body",
        "packages/button",
        "packages/code-block",
        "packages/code-inline",
        "packages/column",
        "packages/components",
        "packages/container",
        "packages/create-email",
        "packages/eslint-config-custom",
        "packages/font",
        "packages/head",
        "packages/heading",
        "packages/hr",
        "packages/html",
        "packages/img",
        "packages/link",
        "packages/markdown",
        "packages/preview",
        "packages/react-email",
        "packages/render",
        "packages/row",
        "packages/section",
        "packages/tailwind",
        "packages/text",
        "packages/tsconfig",
        "benchmarks/tailwind-component",
      ]);
    }
  });
});
