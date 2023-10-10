// From https://github.com/jacobbuck/css-to-style

const camelCase = (string: string) =>
  string.replace(/-(\w|$)/g, (_, p1: string) => p1.toUpperCase());

const convertPropertyName = (prop: string) => {
  let modifiedProp = prop;

  modifiedProp = modifiedProp.toLowerCase();

  if (modifiedProp === "float") {
    return "cssFloat";
  }

  if (modifiedProp.startsWith("--")) {
    return modifiedProp;
  }

  if (modifiedProp.startsWith("-ms-")) {
    modifiedProp = modifiedProp.substr(1);
  }

  return camelCase(modifiedProp);
};

const splitDeclarations = (cssText: string) => {
  const declarations = [];
  let capturing;
  let i = cssText.length;
  let last = i;

  while (i-- > -1) {
    if ((cssText[i] === '"' || cssText[i] === "'") && cssText[i - 1] !== "\\") {
      if (!capturing) {
        capturing = cssText[i];
      } else if (cssText[i] === capturing) {
        capturing = false;
      }
    }
    if (!capturing && cssText[i] === ")") {
      capturing = cssText[i];
    }
    if (cssText[i] === "(" && capturing === ")") {
      capturing = false;
    }
    if (i < 0 || (!capturing && cssText[i] === ";")) {
      declarations.unshift(cssText.slice(i + 1, last));
      last = i;
    }
  }

  return declarations;
};

const splitDeclaration = (declaration: string) => {
  const i = declaration.indexOf(":");
  return [declaration.substr(0, i).trim(), declaration.substr(i + 1).trim()];
};

export const cssToJsxStyle = (cssText: string) =>
  splitDeclarations(cssText)
    .map(splitDeclaration)
    .reduce((styles: Record<string, string>, [name, value]) => {
      if (name && value) {
        styles[convertPropertyName(name)] = value;
      }
      return styles;
    }, {});
