import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { camelCase } from "change-case";
import { caniemailDataURL } from "./src/data/get-all-support-entries";
import type {
  EmailClient,
  Platform,
  SupportResponse,
} from "./src/data/support-response";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function run() {
  const responseFromCaniemail = await fetch(caniemailDataURL);

  const response = (await responseFromCaniemail.json()) as SupportResponse;

  const supportEntries = response.data;

  const platformsPerEmailClient = new Map<EmailClient, Set<Platform>>();

  for (const supportEntry of supportEntries) {
    for (const [emailClient, supportPerPlatform] of Object.entries(
      supportEntry.stats,
    )) {
      if (!platformsPerEmailClient.has(emailClient as EmailClient)) {
        platformsPerEmailClient.set(emailClient as EmailClient, new Set());
      }
      const set = platformsPerEmailClient.get(emailClient as EmailClient)!;

      for (const platform of Object.keys(supportPerPlatform)) {
        set.add(platform as Platform);
      }
    }
  }

  if (fs.existsSync(path.resolve(__dirname, "src/rules"))) {
    await fs.promises.rm(path.resolve(__dirname, "src/rules"), {
      recursive: true,
    });
  }
  await fs.promises.mkdir(path.resolve(__dirname, "src/rules"));

  const importsForIndex: string[] = [];
  const exportsForIndex: string[] = [];

  for await (const [
    emailClient,
    platforms,
  ] of platformsPerEmailClient.entries()) {
    console.log(`Generating rules for\n
    ${emailClient} - ${Array.from(platforms).join(", ")}
    `);

    for await (const platform of platforms.values()) {
      const noUnsupportedRulePath = path.resolve(
        __dirname,
        `src/rules/no-unsupported-on-${emailClient}-${platform}.ts`,
      );
      await fs.promises.writeFile(
        noUnsupportedRulePath,
        `import type { SupportEntry } from "../data/support-response";
import { createNoUnsupportedOn } from "../create-no-unsupported-on";
import { withSupportPerVersion } from "../data/with-support-per-version";

export default (supportEntries: SupportEntry[]) => {
  return createNoUnsupportedOn(
    withSupportPerVersion(supportEntries, "${emailClient}", "${platform}"),
    "${response.nicenames.family[emailClient]} for ${response.nicenames.platform[platform]}",
  );
};\n`,
        "utf8",
      );

      const noPartiallySupportedRulePath = path.resolve(
        __dirname,
        `src/rules/no-partially-supported-on-${emailClient}-${platform}.ts`,
      );
      await fs.promises.writeFile(
        noPartiallySupportedRulePath,
        `import type { SupportEntry } from "../data/support-response";
import { createNoPartiallySupportedOn } from "../create-no-partially-supported-on";
import { withSupportPerVersion } from "../data/with-support-per-version";

export default (supportEntries: SupportEntry[]) => {
  return createNoPartiallySupportedOn(
    withSupportPerVersion(supportEntries, "${emailClient}", "${platform}"),
    "${response.nicenames.family[emailClient]} for ${response.nicenames.platform[platform]}",
  );
};\n`,
        "utf8",
      );

      const noUnsupportedRuleFilename = path.basename(
        noUnsupportedRulePath,
        ".ts",
      );
      importsForIndex.push(
        `import ${camelCase(noUnsupportedRuleFilename).replaceAll(
          "_",
          "",
        )} from "./${noUnsupportedRuleFilename}";`,
      );
      exportsForIndex.push(
        `${camelCase(noUnsupportedRuleFilename).replaceAll("_", "")},`,
      );

      const noPartiallySupportedRuleFilename = path.basename(
        noPartiallySupportedRulePath,
        ".ts",
      );
      importsForIndex.push(
        `import ${camelCase(noPartiallySupportedRuleFilename).replaceAll(
          "_",
          "",
        )} from "./${noPartiallySupportedRuleFilename}";`,
      );
      exportsForIndex.push(
        `${camelCase(noPartiallySupportedRuleFilename).replaceAll("_", "")},`,
      );
    }
  }

  const indexPath = path.resolve(__dirname, "src/rules/index.ts");

  await fs.promises.writeFile(
    indexPath,
    `${importsForIndex.join("\n")}

export {
  ${exportsForIndex.join("\n  ")}
};\n`,
    "utf8",
  );
}

run().catch((err) => {
  console.error(err);
});
