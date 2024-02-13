import path from "node:path";
import { isGlob } from "./is-glob";

test("isGlob", () => {
  expect(isGlob(__dirname)).toBe(false);
  expect(isGlob(path.join(__dirname, "*"))).toBe(true);
  expect(isGlob(path.join(__dirname, "**", "*"))).toBe(true);
});
