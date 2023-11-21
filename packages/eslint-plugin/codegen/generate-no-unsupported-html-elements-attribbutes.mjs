// @ts-check
import { basename } from 'path';

import { getFeaturesDataWithPrefix } from './utils/get-features-data-with-prefix.mjs';
import { computeFeatureSupportPercentage } from './utils/compute-feature-support-percentage.mjs';
import { addRule } from './utils/add-rule.mjs';

const featuresWithFilename = getFeaturesDataWithPrefix('html');


for (const { filename, feature } of featuresWithFilename) {
  const supportPercetange = computeFeatureSupportPercentage(feature);

  if (supportPercetange < 0.72) { // means it does not have great support
    const featureNamePrefixed = basename(filename, '.md');
    const featureName = featureNamePrefixed.replace('html-', '');
    const featurePageTitle = feature.title;

    // pretty loose checking for weather the feature is for an HTML attribute
    if (featurePageTitle.toLowerCase().endsWith('attribute')) {
      addRule(featureNamePrefixed, `import { createNoHTMLAttributeRule } from "../utils/create-no-html-attribute-rule";

export default createNoHTMLAttributeRule(
  '${featureName}',
  ${supportPercetange * 100},
  'https://www.caniemail.com/features/${featureNamePrefixed}/'
)`);
    } else {
      const featurePageTitle = feature.title;

      // pretty loose checking for weather the feature is for an HTML attribute
      if (featurePageTitle.toLowerCase().endsWith('attribute')) {
        addRule(
          featureNamePrefixed, 
          `import { createNoHTMLAttributeRule } from "../utils/create-no-html-attribute-rule";

export default createNoHTMLAttributeRule(
  '${featureName}',
  ${supportPercetange * 100},
  'https://www.caniemail.com/features/${featureNamePrefixed}/'
)`
        );
      } else {
        addRule(
          featureNamePrefixed, 
          `import { createNoHTMLElementRule } from "../utils/create-no-html-element-rule";

export default createNoHTMLElementRule(
  '${featureName}',
  ${supportPercetange * 100},
  'https://www.caniemail.com/features/${featureNamePrefixed}/'
)`
        );
      }
    }
  }
}
