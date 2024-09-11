import { defineConfig } from "tsup";

export default defineConfig({
  dts: true,
  entry: ["./src/node/index.ts"],
  outDir: "./dist/node",
  format: ["cjs", "esm"],
});
