import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  target: "es2020",

  dts: true,

  skipNodeModulesBundle: false,
  external: ["react"],
  // we need to bundle these two in because of the pnpm patches
  // we apply to them to fix issues and make the experience
  // for the component smoother
  noExternal: ["tailwindcss", "postcss-css-variables"],
});
