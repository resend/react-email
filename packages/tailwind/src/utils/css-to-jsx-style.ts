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
    modifiedProp = modifiedProp.slice(1);
  }

  return camelCase(modifiedProp);
};

export const cssToJsxStyle = (cssText: string) => {
  const style: Record<string, string> = {};
  const declarations = cssText.matchAll(
    /([a-zA-Z0-9\-_]+)\s*:\s*('[^']*'[^;]*|"[^"]*"[^;]*|.*?\([^)]*\)[^;]*|[^;]*);?/gm,
  );
  for (const [_declaration, property, value] of declarations) {
    if (property.length > 0 && value.trim().length > 0) {
      style[convertPropertyName(property)] = value.trim();
    }
  }
  return style;
};
