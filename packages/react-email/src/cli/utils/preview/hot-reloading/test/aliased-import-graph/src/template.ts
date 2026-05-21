/** biome-ignore-all lint/correctness/noUnusedVariables: used in testing */

export const loadMessages = (lng: string, ns: string) =>
  // @ts-expect-error -- alias resolution provided by the test's tsconfig
  import(`@/locales/${lng}/${ns}.json`);
