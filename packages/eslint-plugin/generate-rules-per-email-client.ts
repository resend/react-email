import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { camelCase } from "change-case";
import { caniemailDataURL } from "./src/data/get-all-support-entries";
import type {
  EmailClient,
  Platform,
  CaniemailOrderedDataResponse,
} from "./src/data/support-response";
import { fromCamelToKebabCase } from "./src/casing/from-camel-to-kebab-case";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function run() {
  const responseFromCaniemail = await fetch(caniemailDataURL);

  const response =
    (await responseFromCaniemail.json()) as unknown as CaniemailOrderedDataResponse;

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

    /*
      We do this repetitive string casing conversion because, for some email client name
      slugs, caniemail does not have proper casing. One of the examples is
      
      ionos-1and1
      
      It merges this "1and1" into one "word", even though it's not easy to do this conversion programatically. That is with our fromCamelToKebabCase function. 

      It's important that we take this into account because we generate the rule
      names programatically based on the camelcased version of these filenames
      on the [index.ts](./src/index.ts) file. 

      If we don't do this the actual name of the rules won't match their filenames, 
      which might cause issues.
    */
    const properKebabCasedEmailClient = fromCamelToKebabCase(
      camelCase(emailClient).replaceAll('_', ''),
    );

    for await (const platform of platforms.values()) {
      const noUnsupportedRulePath = path.resolve(
        __dirname,
        `src/rules/no-unsupported-on-${properKebabCasedEmailClient}-${platform}.ts`,
      );
      await fs.promises.writeFile(
        noUnsupportedRulePath,
        `import { createNoUnsupportedOn } from "../create-no-unsupported-on";
import type { SupportEntriesByCategory } from "../data/separate-entries-by-category";

export default (supportEntriesByCategory: SupportEntriesByCategory) => {
  return createNoUnsupportedOn(
    supportEntriesByCategory,
    "${response.nicenames.family[emailClient]} for ${response.nicenames.platform[platform]}",
    "${emailClient}",
    "${platform}",
  );
};\n`,
        "utf8",
      );

      const noPartiallySupportedRulePath = path.resolve(
        __dirname,
        `src/rules/no-partially-supported-on-${properKebabCasedEmailClient}-${platform}.ts`,
      );
      await fs.promises.writeFile(
        noPartiallySupportedRulePath,
        `import { createNoPartiallySupportedOn } from "../create-no-partially-supported-on";
import type { SupportEntriesByCategory } from "../data/separate-entries-by-category";

export default (supportEntriesByCategory: SupportEntriesByCategory) => {
  return createNoPartiallySupportedOn(
    supportEntriesByCategory,
    "${response.nicenames.family[emailClient]} for ${response.nicenames.platform[platform]}",
    "${emailClient}",
    "${platform}",
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
