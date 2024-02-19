import path from "node:path";
import { isFirstDepthGlob } from "./is-first-depth-glob";

test("isFirstDepthGlob", () => {
  expect(isFirstDepthGlob(path.join(__dirname, "*"))).toBe(true);
  expect(isFirstDepthGlob(path.join(__dirname, "**", "*"))).toBe(false);
  expect(isFirstDepthGlob(path.join(__dirname, "**", "*"))).toBe(false);
});
