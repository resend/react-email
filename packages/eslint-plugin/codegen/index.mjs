import { rm, mkdir, writeFile } from "node:fs/promises";
import { generateNoUnsupportedStyleRules } from "./generate-no-unsupported-style-rules.mjs";
import { generateNoUnsupportedHTMLElementsAndAttributes } from "./generate-no-unsupported-html-elements-attribbutes.mjs";

(async () => {
  await rm("src/rules/generated", { recursive: true });

  await mkdir("src/rules/generated");
  await writeFile("src/rules/generated/index.ts", "");

  await generateNoUnsupportedStyleRules();
  await generateNoUnsupportedHTMLElementsAndAttributes();
})();
