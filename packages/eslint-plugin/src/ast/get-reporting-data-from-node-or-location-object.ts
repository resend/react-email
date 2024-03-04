import type { TSESTree } from "@typescript-eslint/utils";

export const getReportingDataFromNodeOrLocationObject = (
  nodeOrLocationObject:
    | TSESTree.Node
    | {
        location: [start: TSESTree.Position, end: TSESTree.Position];
      },
) => {
  if ("location" in nodeOrLocationObject) {
    const { location } = nodeOrLocationObject;
    return {
      loc: {
        start: location[0],
        end: location[1],
      },
    };
  }

  const node = nodeOrLocationObject;
  return { node };
};
