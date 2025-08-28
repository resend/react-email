import { AtRule, type Declaration, type Root, Rule } from 'postcss';
import { removeIfEmptyRecursively } from './remove-if-empty-recursively';

interface VariableUse {
  declaration: Declaration;
  fallback?: string;
  variableName: string;
  raw: string;
}

interface VariableDefinition {
  declaration: Declaration;
  variableName: string;
  definition: string;
}

const doSelectorsIntersect = (first: string, second: string): boolean => {
  if (first === second) {
    return true;
  }

  if (first.includes(':root') || second.includes(':root')) {
    return true;
  }

  if (first.includes('*') || second.includes('*')) {
    return true;
  }

  return false;
};

export const resolveAllCSSVariables = (root: Root) => {
  const variableDefinitions = new Set<VariableDefinition>();
  const variableUses = new Set<VariableUse>();

  root.walkDecls((declaration) => {
    if (/--[^\s]+/.test(declaration.prop)) {
      variableDefinitions.add({
        declaration,
        variableName: `${declaration.prop}`,
        definition: declaration.value,
      });
    } else {
      for (const [match, variableName, fallback] of declaration.value.matchAll(
        /var\((--[^\s)]+)(?:,\s*([^)]+))?\)/gm,
      )) {
        variableUses.add({
          declaration,
          fallback,
          variableName,
          raw: match,
        });
      }
    }
  });

  for (const use of variableUses) {
    let hasReplaced = false;
    for (const definition of variableDefinitions) {
      if (use.variableName !== definition.variableName) {
        continue;
      }

      if (
        use.declaration.parent instanceof AtRule &&
        use.declaration.parent.parent instanceof Rule &&
        definition.declaration.parent instanceof Rule &&
        doSelectorsIntersect(
          use.declaration.parent.parent.selector,
          definition.declaration.parent.selector,
        )
      ) {
        use.declaration.value = use.declaration.value.replaceAll(
          use.raw,
          definition.definition,
        );
        hasReplaced = true;
        break;
      }

      if (
        use.declaration.parent instanceof Rule &&
        definition.declaration.parent instanceof Rule &&
        doSelectorsIntersect(
          use.declaration.parent.selector,
          definition.declaration.parent.selector,
        )
      ) {
        use.declaration.value = use.declaration.value.replaceAll(
          use.raw,
          definition.definition,
        );
        hasReplaced = true;
        break;
      }
    }

    if (!hasReplaced && use.fallback) {
      use.declaration.value = use.declaration.value.replaceAll(
        use.raw,
        use.fallback,
      );
    }
  }

  for (const definition of variableDefinitions) {
    const parent = definition.declaration.parent;
    definition.declaration.remove();
    if (parent) {
      removeIfEmptyRecursively(parent);
    }
  }

  return root;
};
