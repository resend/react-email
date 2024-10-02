import { fromDashCaseToCamelCase } from "../text/from-dash-case-to-camel-case";

export const convertCssPropertyToReactProperty = (prop: string) => {
  let modifiedProp = prop;

  modifiedProp = modifiedProp.toLowerCase();

  if (modifiedProp === "float") {
    return "cssFloat";
  }

  if (modifiedProp.startsWith("--")) {
    return modifiedProp;
  }

  if (modifiedProp.startsWith("-ms-")) {
    return fromDashCaseToCamelCase(modifiedProp.slice(1));
  }

  return fromDashCaseToCamelCase(modifiedProp);
};
