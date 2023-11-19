// @ts-check
import { basename } from 'path';

import { getFeaturesDataWithPrefix } from './utils/get-features-data-with-prefix.mjs';
import { computeFeatureSupportPercentage } from './utils/compute-feature-support-percentage.mjs';
import { addRule } from './utils/add-rule.mjs';

const featuresWithFilename = getFeaturesDataWithPrefix('css');

for (const { filename, feature } of featuresWithFilename) {
  const supportPercetange = computeFeatureSupportPercentage(feature);

  if (supportPercetange < 0.90) { // means it is mostly unsupported
    const cssProperty = basename(filename, '.md').replace('css-', '');

    addRule(
      cssProperty, 
      `import { createNoStylePropertyRule } from "../utils/create-no-style-property-rule";

export default createNoStylePropertyRule(
  '${cssProperty}', 
  ${supportPercetange * 100}, 
  'https://www.caniemail.com/features/${basename(filename, '.md')}/'
);
`
    );
  }
}

