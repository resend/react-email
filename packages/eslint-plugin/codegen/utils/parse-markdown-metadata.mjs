// @ts-check

import { load } from "js-yaml";

/**
  * @param contents {string}
  */
export const parseMarkdownMetadata = (
  contents
) => {
  const lines = contents.split("\n");
  const metaIndices = lines.reduce((mem, item, i) => {
    if (/^---/.test(item)) {
      mem.push(i);
    }

    return mem;
  }, []);

  if (metaIndices.length > 0) {
    const metadata = lines.slice(metaIndices[0] + 1, metaIndices[1]);
    return load(metadata.join("\n"), {
      json: true,
    });
  }

  return undefined;
};
