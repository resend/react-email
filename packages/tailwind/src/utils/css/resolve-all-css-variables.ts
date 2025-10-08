import {
  type CssNode,
  type Declaration,
  generate,
  type List,
  type ListItem,
  parse,
  type Raw,
  type SelectorList,
  type Value,
  walk,
} from 'css-tree';

interface VariableUse {
  declaration: Declaration;
  path: CssNode[];
  fallback?: string;
  variableName: string;
  raw: string;
}

export interface VariableDefinition {
  declaration: Declaration;
  path: CssNode[];
  variableName: string;
  definition: string;
}

function doSelectorsIntersect(
  first: SelectorList | Raw,
  second: SelectorList | Raw,
): boolean {
  const firstStringified = generate(first);
  const secondStringified = generate(second);
  if (firstStringified === secondStringified) {
    return true;
  }

  let hasSomeUniversal = false;
  const walker = (
    node: CssNode,
    _parentListItem: ListItem<CssNode>,
    parentList: List<CssNode>,
  ) => {
    if (hasSomeUniversal) return;
    if (node.type === 'PseudoClassSelector' && node.name === 'root') {
      hasSomeUniversal = true;
    }
    if (
      node.type === 'TypeSelector' &&
      node.name === '*' &&
      parentList.size === 1
    ) {
      hasSomeUniversal = true;
    }
  };
  walk(first, walker);
  walk(second, walker);

  if (hasSomeUniversal) {
    return true;
  }

  return false;
}

export function resolveAllCssVariables(node: CssNode) {
  const variableDefinitions = new Set<VariableDefinition>();
  const variableUses = new Set<VariableUse>();

  const path: CssNode[] = [];

  walk(node, {
    leave() {
      path.shift();
    },
    enter(node: CssNode) {
      if (node.type === 'Declaration') {
        const declaration = node;
        // Ignores @layer (properties) { ... } to avoid variable resolution conflicts
        if (
          path.some(
            (ancestor) =>
              ancestor.type === 'Atrule' &&
              ancestor.name === 'layer' &&
              ancestor.prelude !== null &&
              generate(ancestor.prelude).includes('properties'),
          )
        ) {
          path.unshift(node);
          return;
        }

        if (/--[\S]+/.test(declaration.property)) {
          variableDefinitions.add({
            declaration,
            path: [...path],
            variableName: declaration.property,
            definition: generate(declaration.value),
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
                    path: [...path],
                    fallback,
                    variableName: name,
                    raw: generate(funcNode),
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
      }
      path.unshift(node);
    },
  });

  for (const use of variableUses) {
    let hasReplaced = false;

    for (const definition of variableDefinitions) {
      if (use.variableName !== definition.variableName) {
        continue;
      }

      if (
        use.path[0]?.type === 'Block' &&
        use.path[1]?.type === 'Atrule' &&
        use.path[2]?.type === 'Block' &&
        use.path[3]?.type === 'Rule' &&
        definition.path[0].type === 'Block' &&
        definition.path[1].type === 'Rule' &&
        doSelectorsIntersect(use.path[3].prelude, definition.path[1].prelude)
      ) {
        use.declaration.value = parse(
          generate(use.declaration.value).replaceAll(
            use.raw,
            definition.definition,
          ),
          {
            context: 'value',
          },
        ) as Raw | Value;
        hasReplaced = true;
        break;
      }

      if (
        use.path[0]?.type === 'Block' &&
        use.path[1]?.type === 'Rule' &&
        definition.path[0]?.type === 'Block' &&
        definition.path[1]?.type === 'Rule' &&
        doSelectorsIntersect(use.path[1].prelude, definition.path[1].prelude)
      ) {
        use.declaration.value = parse(
          generate(use.declaration.value).replaceAll(
            use.raw,
            definition.definition,
          ),
          {
            context: 'value',
          },
        ) as Raw | Value;
        hasReplaced = true;
        break;
      }
    }

    if (!hasReplaced && use.fallback) {
      use.declaration.value = parse(
        generate(use.declaration.value).replaceAll(use.raw, use.fallback),
        { context: 'value' },
      ) as Raw | Value;
    }
  }
}
