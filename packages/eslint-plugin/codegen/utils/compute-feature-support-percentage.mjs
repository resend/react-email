// @ts-check

/**
  * @param feature {import('zod').z.infer<typeof import('./get-features-data-with-prefix.mjs').featureSchema>}
  */
export const computeFeatureSupportPercentage = (feature) => {
  let abstractSupportedEnvironments = 0;
  let allEnvironments = 0;
  for (const versionSupportPerOs of Object.values(feature.stats)) {
    for (const supportPerVersion of Object.values(versionSupportPerOs)) {
      for (const supported of Object.values(supportPerVersion)) {
        allEnvironments++;
        // using startsWith here because supported generally has references on it
        // such as `a #6 #7`
        if (supported.startsWith('y')) {
          abstractSupportedEnvironments++;
        } else if (supported.startsWith('u')) {
          abstractSupportedEnvironments += 0.25;
        } else if (supported.startsWith('a')) {
          abstractSupportedEnvironments += 0.5;
        }
      }
    }
  }

  return abstractSupportedEnvironments / allEnvironments;
};
