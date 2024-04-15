import { promises as fs } from "fs";
import path from "path";
import url from "url";
import { build } from "esbuild";
import { polyfillCodeForQuickJS } from "../quickjs-polyfills/polyfill-code-for-quickjs.mjs";

const dirname = path.dirname(url.fileURLToPath(import.meta.url));

const result = await build({
  entryPoints: [path.resolve(dirname, "./src/index.js")],
  write: false,
  bundle: true,
  minify: false,
  format: "cjs",
  target: "es2020"
});

const code = await polyfillCodeForQuickJS(result.outputFiles[0].text);

await fs.writeFile(path.resolve(dirname, "./src/index.js"), code, "utf8");

