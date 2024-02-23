import path from "node:path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react(), dts({ include: ["src"], outDir: "dist" })],
  build: {
    rollupOptions: {
      external: ["react", "react-dom", /react\/.*/, /react-dom\/.*/],
    },
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      fileName: "index",
      formats: ["es", "cjs"],
    },
    outDir: "dist",
  },
});
