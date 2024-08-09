/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  type Declaration,
  type Plugin,
  type Container,
  type Document,
} from "postcss";

export const cssVariablesResolver = () => {
  const variables = {} as Record<
    string,
    {
      declaration: Declaration;
      usages: Set<Declaration>;
    }
  >;
  const variableUsages = new Set<{
    declaration: Declaration;
    /**
     * @example ['var(--width)', 'var(--length)']
     */
    variablesUsed: string[];
  }>();

  const removeIfEmptyRecursively = (node: Container | Document) => {
    if (node.first === undefined) {
      const parent = node.parent;
      if (parent) {
        node.remove();
        removeIfEmptyRecursively(parent);
      }
    }
  };

  return {
    postcssPlugin: "CSS Variables Resolver",
    Once(root) {
      root.walkDecls((decl) => {
        if (/--[^\s]+/.test(decl.prop)) {
          variables[decl.prop] = {
            declaration: decl,
            usages: new Set(),
          };
        }
      });
      root.walkDecls((decl) => {
        if (/var\(--[^\s)]+\)/.test(decl.value)) {
          const matches = /var\(--[^\s)]+\)/gm.exec(decl.value)!;
          variableUsages.add({
            declaration: decl,
            variablesUsed: matches,
          });
          for (const variable of matches) {
            const variableName = variable.slice(4, -1);
            variables[variableName].usages.add(decl);
          }
        }
      });

      for (const usage of variableUsages) {
        for (const variable of usage.variablesUsed) {
          const variableName = variable.slice(4, -1);
          usage.declaration.value = usage.declaration.value.replaceAll(
            variable,
            variables[variableName].declaration.value,
          );
        }
        for (const variable of usage.variablesUsed) {
          const variableName = variable.slice(4, -1);
          variables[variableName].usages.delete(usage.declaration);
        }
        variableUsages.delete(usage);
      }

      for (const variable of Object.values(variables)) {
        console.log(variable);
        if (variable.usages.size === 0) {
          const parent = variable.declaration.parent;
          if (parent) {
            variable.declaration.remove();
            removeIfEmptyRecursively(parent);
          }
        }
      }
    },
  } satisfies Plugin;
};
