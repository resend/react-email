import { defineConfig } from "tsup";

export default defineConfig({
  dts: true,
  entry: ["./src/index.ts"],
  outDir: "./dist/node",
  format: ["cjs", "esm"],
});
