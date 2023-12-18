// @ts-check
import { basename } from "node:path";
import { getFeaturesDataWithPrefix } from "./utils/get-features-data-with-prefix.mjs";
import { computeFeatureSupportPercentage } from "./utils/compute-feature-support-percentage.mjs";
import { addRule } from "./utils/add-rule.mjs";
import { allCssProperties } from "./utils/all-css-properties.mjs";

export async function generateNoUnsupportedStyleRules() {
  const featuresWithFilename = await getFeaturesDataWithPrefix("css");

  for await (const { filename, feature } of featuresWithFilename) {
    const supportPercetange = computeFeatureSupportPercentage(feature);

    if (supportPercetange < 0.75) {
      // means it does not have great support
      const featureNamePrefixed = basename(filename, ".md");
      const cssFeatureName = featureNamePrefixed.replace("css-", "");

      if (allCssProperties.includes(cssFeatureName)) {
        await addRule(
          featureNamePrefixed,
          `import { createNoStylePropertyRule } from "../../utils/create-no-style-property-rule";

export default createNoStylePropertyRule(
  "${cssFeatureName}",
  ${supportPercetange * 100},
  "https://www.caniemail.com/features/${featureNamePrefixed}/",
);
`,
        );
      } else {
        await addRule(
          featureNamePrefixed,
          `import { createNoStyleValueKeywordRule } from "../../utils/create-no-style-value-keyword-rule";

export default createNoStyleValueKeywordRule(
  "${cssFeatureName}",
  ${supportPercetange * 100},
  "https://www.caniemail.com/features/${featureNamePrefixed}/",
);
`,
        );
      }
    }
  }
}
