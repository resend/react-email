import { promises as fs } from "fs";
import { build } from "esbuild";
import { polyfillCodeForQuickJS } from "./quickjs-polyfills/polyfill-code-for-quickjs.mjs";

const result = await build({
  entryPoints: ["src/index.js"],
  write: false,
  bundle: true,
  minify: false,
  format: "cjs",
  target: "es2020"
});

const code = await polyfillCodeForQuickJS(result.outputFiles[0].text);

await fs.writeFile("src/index.cjs", code, "utf8");

