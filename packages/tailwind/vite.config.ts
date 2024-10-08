import { resolve } from "node:path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [dts({ include: ["src"], outDir: "dist" })],
  build: {
    rollupOptions: {
      // in summary, this bundles the following since vite defaults to bundling
      // - tailwindcss
      // - postcss
      // - postcss-selector-parser
      external: ["react", /^react\/.*/, "react-dom", /react-dom\/.*/],
    },
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      fileName: "index",
      formats: ["es", "cjs"],
    },
    outDir: "dist",
  },
});
