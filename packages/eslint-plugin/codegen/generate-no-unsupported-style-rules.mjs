// @ts-check
import { basename } from 'path';

import { getFeaturesDataWithPrefix } from './utils/get-features-data-with-prefix.mjs';
import { computeFeatureSupportPercentage } from './utils/compute-feature-support-percentage.mjs';
import { addRule } from './utils/add-rule.mjs';
import { allCssProperties } from './utils/all-css-properties.mjs';

const featuresWithFilename = getFeaturesDataWithPrefix('css');

for (const { filename, feature } of featuresWithFilename) {
  const supportPercetange = computeFeatureSupportPercentage(feature);

  if (supportPercetange < 0.75) { // means it does not have great support
    const featureNamePrefixed = basename(filename, '.md');
    const cssFeatureName = featureNamePrefixed.replace('css-', '');

    if (allCssProperties.includes(cssFeatureName)) {
      addRule(
        featureNamePrefixed,
        `import { createNoStylePropertyRule } from "../utils/create-no-style-property-rule";

export default createNoStylePropertyRule(
  '${cssFeatureName}', 
  ${supportPercetange * 100}, 
  'https://www.caniemail.com/features/${featureNamePrefixed}/'
);
`
      );
    } else {
      addRule(
        featureNamePrefixed,
        `import { createNoStyleValueKeywordRule } from "../utils/create-no-style-value-keyword-rule";

export default createNoStyleValueKeywordRule(
  '${cssFeatureName}', 
  ${supportPercetange * 100}, 
  'https://www.caniemail.com/features/${featureNamePrefixed}/'
);
`
      );
    }
  }
}

