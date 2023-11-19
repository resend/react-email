// @ts-check

/**
  * @param feature {import('zod').z.infer<typeof import('./get-features-data-with-prefix.mjs').featureSchema>}
  */
export const computeFeatureSupportPercentage = (feature) => {
  let supportedEnvironments = 0;
  let allEnvironments = 0;
  for (const versionSupportPerOs of Object.values(feature.stats)) {
    for (const supportPerVersion of Object.values(versionSupportPerOs)) {
      for (const supported of Object.values(supportPerVersion)) {
        allEnvironments++;
        if (supported === 'y') {
          supportedEnvironments++;
        }
      }
    }
  }

  return supportedEnvironments / allEnvironments;
};
