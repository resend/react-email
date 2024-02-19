import path from "node:path";
import { findMonorepoRoot } from "./find-monorepo-root";

describe("tests with pnpm", () => {
  const monorepoRoot = path.resolve(__dirname, "../../../..");

  test("on the path for this file", async () => {
    expect(await findMonorepoRoot(__filename)).toBe(monorepoRoot);
  });

  test("on the path of this file's folder", async () => {
    expect(await findMonorepoRoot(__dirname)).toBe(monorepoRoot);
  });

  test("on the path of this package's directory", async () => {
    expect(await findMonorepoRoot(__dirname)).toBe(monorepoRoot);
  });

  test("on the 'packages' directory", async () => {
    expect(await findMonorepoRoot(path.resolve(__dirname, "../../.."))).toBe(
      monorepoRoot,
    );
  });

  test("on the monorepo's root", async () => {
    expect(await findMonorepoRoot(path.resolve(__dirname, "../../../.."))).toBe(
      monorepoRoot,
    );
  });

  test("outside of the monorepo", async () => {
    expect(
      await findMonorepoRoot(path.resolve(__dirname, "../../../../..")),
    ).toBeUndefined();
  });
});
