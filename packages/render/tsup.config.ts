import { defineConfig } from "tsup";

export default defineConfig([
  {
    dts: true,
    entry: ["./src/node/index.ts"],
    outDir: "./dist/node",
    format: ["cjs", "esm"],
  },
  {
    dts: true,
    entry: ["./src/edge-light/index.ts"],
    outDir: "./dist/edge-light",
    format: ["cjs", "esm"],
  },
  {
    dts: true,
    entry: ["./src/browser/index.ts"],
    outDir: "./dist/browser",
    format: ["cjs", "esm"],
  },
]);
