// @ts-check
import path, { basename } from 'path';

import { getFeaturesDataWithPrefix } from './utils/get-features-data-with-prefix.mjs';
import { computeFeatureSupportPercentage } from './utils/compute-feature-support-percentage.mjs';
import { addRule } from './utils/add-rule.mjs';

const featuresWithFilename = getFeaturesDataWithPrefix('html');


for (const { filename, feature } of featuresWithFilename) {
  const supportPercetange = computeFeatureSupportPercentage(feature);

  if (supportPercetange < 0.85) { // means it does not have great support
    const featureName = basename(filename, '.md').replace('html-', '');
    const featurePageTitle = feature.title;

    // pretty loose checking for weather the feature is for an HTML attribute
    if (featurePageTitle.toLowerCase().endsWith('attribute')) {
      addRule(featureName, `import { createNoHTMLAttributeRule } from "../utils/create-no-html-attribute-rule";

export default createNoHTMLAttributeRule(
  '${featureName}',
  ${supportPercetange * 100},
  'https://www.caniemail.com/features/${basename(filename, '.md')}/'
)`);
    } else {
      const featureName = basename(filename, '.md').replace('html-', '');
      const featurePageTitle = feature.title;

      // pretty loose checking for weather the feature is for an HTML attribute
      if (featurePageTitle.toLowerCase().endsWith('attribute')) {
        addRule(
          featureName, 
          `import { createNoHTMLAttributeRule } from "../utils/create-no-html-attribute-rule";

export default createNoHTMLAttributeRule(
  '${featureName}',
  ${supportPercetange * 100},
  'https://www.caniemail.com/features/${basename(filename, '.md')}/'
)`
        );
      } else {
        addRule(
          featureName, 
          `import { createNoHTMLElementRule } from "../utils/create-no-html-element-rule";

export default createNoHTMLElementRule(
  '${featureName}',
  ${supportPercetange * 100},
  'https://www.caniemail.com/features/${basename(filename, '.md')}/'
)`
        );
      }
    }
  }
}
