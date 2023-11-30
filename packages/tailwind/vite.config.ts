import { resolve } from "node:path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import { nodePolyfills } from "vite-plugin-node-polyfills";

export default defineConfig({
  plugins: [
    dts({ include: ["src"], outDir: "dist" }),
    nodePolyfills({
      include: ["path", "fs", "tty", "crypto", "os", "process"],
      overrides: {
        fs: "memfs",
        process: "process",
      },
    }),
  ],
  build: {
    rollupOptions: {
      external: ['react', 'react-dom', 'postcss']
    },
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      fileName: "index",
      formats: ["es", "cjs"],
    },
    outDir: "dist",
  }
});
