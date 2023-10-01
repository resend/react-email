// From https://github.com/jacobbuck/css-to-style

const camelCase = (string: string) =>
  string.replace(/-(\w|$)/g, (_, p1) => p1.toUpperCase());

const convertPropertyName = (prop: string) => {
  prop = prop.toLowerCase();

  if (prop === "float") {
    return "cssFloat";
  }

  if (prop.startsWith("--")) {
    return prop;
  }

  if (prop.startsWith("-ms-")) {
    prop = prop.substr(1);
  }

  return camelCase(prop);
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
