import path from "node:path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [
    dts({ include: ["src"], outDir: "dist" }),
  ],
  build: {
    rollupOptions: {
      external: ["react", "react-dom", "postcss", /react-dom\/.*/],
    },
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      fileName: "index",
      formats: ["es", "cjs"],
    },
    outDir: "dist",
  },
});
