import { resolve } from "node:path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import { nodePolyfills } from "vite-plugin-node-polyfills";

export default defineConfig({
  plugins: [
    dts({ include: ["src"], outDir: "dist" }),
    nodePolyfills({
      include: ["path", "tty", "fs", "crypto", "process", "os"],
      overrides: {
        fs: "memfs",
        process: "process",
      },
    }),
  ],
  build: {
    rollupOptions: {
      // in summary, this bundles the following since vite defaults to bundling
      // - tailwindcss
      // - postcss
      // - postcss-css-variables
      // - polyfill libraries
      //   - process
      //   - memfs
      external: ["react", "react-dom", /react-dom\/.*/],
    },
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      fileName: "index",
      formats: ["es", "cjs"],
    },
    outDir: "dist",
  },
});
