import { TSESTree } from "@typescript-eslint/utils";
import { SourceCode } from "@typescript-eslint/utils/ts-eslint";

export const propertyNameAndValueFromNode = (
  node: TSESTree.Property,
  sourceCode: Readonly<SourceCode>,
) => {
  const [propertyName] = sourceCode.getText(node.key).trim().match(/\w+/g) ?? [
    "",
  ];
  let propertyValue: string;

  const { groups } = /^(?:"|'|`)(?<valueInQuotes>[^"]*)(?:"|'|`)$/.exec(
    sourceCode.getText(node.value).trim(),
  ) ?? { groups: undefined };
  if (groups?.valueInQuotes !== undefined) {
    propertyValue = groups.valueInQuotes;
  } else {
    propertyValue = sourceCode.getText(node.value);
  }
  return { name: propertyName, value: propertyValue };
};
