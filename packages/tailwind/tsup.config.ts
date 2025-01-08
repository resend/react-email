import { defineConfig } from "tsup";

export default defineConfig({
  dts: true,
  target: ["es2020"],
  entry: ["./src/index.ts"],
  outDir: "./dist",
  treeshake: true,
  noExternal: [
    /patched-tailwindcss\/.*/,
    /patched-postcss\/.*/,
    /postcss\/.*/,
    "dlv",
    "didyoumean",
    "@alloc/quick-lru",
    "patched-postcss-selector-parser",
    "postcss-selector-parser",
    "postcss-js",
    "postcss-nested",
    "cssesc",
    "camelcase-css",
  ],
  format: ["esm", "cjs"],
});
