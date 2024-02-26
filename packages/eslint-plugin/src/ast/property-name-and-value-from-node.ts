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

  // eslint-disable-next-line prefer-named-capture-group
  const [_match, valueInQuotes] = /^"([^"]*)"$|^'([^']*)'$|^`([^`]*)`$/.exec(
    sourceCode.getText(node.value).trim(),
  ) ?? ["", undefined];
  if (typeof valueInQuotes !== "undefined") {
    propertyValue = valueInQuotes;
  } else {
    propertyValue = sourceCode.getText(node.value);
  }
  return { name: propertyName, value: propertyValue };
};
