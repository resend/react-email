import { build } from "esbuild";
import { polyfillCodeForQuickJS } from "../../quickjs-polyfills/polyfill-code-for-quickjs.mjs";

const result = await build({
  entryPoints: [process.argv[2]],
  bundle: true,
  write: false,
  minify: false,
  format: "cjs",
  target: "es2020",
});

const bundledFile = await polyfillCodeForQuickJS(result.outputFiles[0].text);
process.stdout.write(bundledFile);
