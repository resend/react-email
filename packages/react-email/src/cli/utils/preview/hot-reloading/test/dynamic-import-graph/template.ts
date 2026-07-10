/** biome-ignore-all lint/correctness/noUnusedVariables: used in testing */

export const loadMessages = (lng: string, ns: string) =>
  import(`./messages/${lng}/${ns}.json`);
