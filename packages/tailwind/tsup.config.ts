import { defineConfig } from "tsup";

export default defineConfig({
  dts: true,
  target: ["es2020"],
  entry: ["./src/index.ts"],
  outDir: "./dist",
  treeshake: true,
  noExternal: [
    /tailwindcss\/.*/,
    /postcss\/.*/,
    "dlv",
    "didyoumean",
    "@alloc/quick-lru",
    "postcss-selector-parser",
    "postcss-js",
    "postcss-nested",
    "cssesc",
    "camelcase-css"
  ],
  format: ["esm", "cjs"],
});
