import path from "path";
import { promises as fs } from "fs";
import { build } from "esbuild";
import url from "url";
import { polyfillCodeForQuickJS } from "../quickjs-polyfills/polyfill-code-for-quickjs.mjs";
const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

const result = await build({
  entryPoints: [process.argv[2]],
  bundle: true,
  write: false,
  minify: false,
  format: "cjs",
  target: "es2020",
});

const bundledFile = await polyfillCodeForQuickJS(result.outputFiles[0].text);
await fs.writeFile(
  path.resolve(__dirname, "../compiled-template.js"),
  bundledFile,
  "utf8",
);
process.stdout.write(bundledFile);
