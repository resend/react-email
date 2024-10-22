import path from "node:path";
import { getMonorepoMetadata } from "./get-monorepo-metadata";

describe("tests with pnpm", () => {
  test("should return the right workspaces", async () => {
    const meta = await getMonorepoMetadata(__dirname);

    expect(meta).toBeDefined();

    if (typeof meta !== "undefined") {
      expect(meta.monorepoRoot).toBe(path.resolve(__dirname, "../../../.."));
      expect(meta.workspaceGlobs).toEqual([
        "apps/web",
        "apps/demo",
        "examples/*",
        "examples/*/*",
        "packages/*",
        "packages/create-email/templates/*",
        "benchmarks/*",
      ]);
    }
  });
});
