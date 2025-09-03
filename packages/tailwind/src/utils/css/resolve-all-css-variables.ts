import {
  type CssNode,
  type Declaration,
  generate,
  walk,
  parse,
  lexer,
} from 'css-tree';

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

  remove(): void;
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

export const resolveAllCSSVariables = (node: CssNode) => {
  const variableDefinitions = new Set<VariableDefinition>();
  const variableUses = new Set<VariableUse>();

  walk(node, {
    visit: 'Declaration',
    enter(declaration, item, list) {
      if (/--[\S]+/.test(declaration.property)) {
        variableDefinitions.add({
          declaration,
          variableName: `${declaration.property}`,
          definition: generate(declaration.value),
          remove() {
            list.remove(item);
          },
        });
      } else {
        function parseVariableUsesFrom(node: CssNode) {
          walk(node, {
            visit: 'Function',
            enter(funcNode) {
              if (funcNode.name === 'var') {
                const children = funcNode.children.toArray();
                const name = generate(children[0]);
                const fallback =
                  // The second argument should be an "," Operator Node,
                  // such that the actual fallback is only in the third argument
                  children[2] ? generate(children[2]) : undefined;

                variableUses.add({
                  declaration,
                  fallback,
                  variableName: name,
                  raw: generate(node),
                });

                if (fallback?.includes('var(')) {
                  const parsedFallback = parse(fallback, {
                    context: 'value',
                  });

                  parseVariableUsesFrom(parsedFallback);
                }
              }
            },
          });
        }

        parseVariableUsesFrom(declaration.value);
      }
    },
  });

  console.log(variableUses);

  /// YOU ARE HERE: just finished implementing the code to find the variable uses with css tree that is much more robust that using regex, now you were about to do the proper handling for resolving the variable uses

  // for (const use of variableUses) {
  //   for (const definition of variableDefinitions) {
  //     if (use.variableName !== definition.variableName) {
  //       continue;
  //     }
  //
  //     if (
  //       use.declaration.parent instanceof AtRule &&
  //       use.declaration.parent.parent instanceof Rule &&
  //       definition.declaration.parent instanceof Rule &&
  //       doSelectorsIntersect(
  //         use.declaration.parent.parent.selector,
  //         definition.declaration.parent.selector,
  //       )
  //     ) {
  //       use.declaration.value = use.declaration.value.replaceAll(
  //         use.raw,
  //         definition.definition,
  //       );
  //       hasReplaced = true;
  //       break;
  //     }
  //
  //     if (
  //       use.declaration.parent instanceof Rule &&
  //       definition.declaration.parent instanceof Rule &&
  //       doSelectorsIntersect(
  //         use.declaration.parent.selector,
  //         definition.declaration.parent.selector,
  //       )
  //     ) {
  //       use.declaration.value = use.declaration.value.replaceAll(
  //         use.raw,
  //         definition.definition,
  //       );
  //       hasReplaced = true;
  //       break;
  //     }
  //   }
  //
  //   if (!hasReplaced && use.fallback) {
  //     use.declaration.value = use.declaration.value.replaceAll(
  //       use.raw,
  //       use.fallback,
  //     );
  //   }
  // }

  for (const definition of variableDefinitions) {
    definition.remove();
  }

  return node;
};
