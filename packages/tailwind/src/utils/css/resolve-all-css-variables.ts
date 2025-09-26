import {
  type CssNode,
  type Declaration,
  generate,
  parse,
  type Raw,
  type SelectorList,
  type Value,
  walk,
} from 'css-tree';
import { populateParentsForNodeTree } from './populate-parents-for-node-tree';

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
  const walker = (node: CssNode) => {
    if (hasSomeUniversal) return;
    if (node.type === 'PseudoClassSelector' && node.name === 'root') {
      hasSomeUniversal = true;
    }
    if (
      node.type === 'TypeSelector' &&
      node.name === '*' &&
      node.containedIn?.size === 1
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

function removeAndRepeatIfEmptyRecursively(node: CssNode) {
  if (node.parent) {
    if (node.containedIn && node.containingItem) {
      node.containedIn.remove(node.containingItem);
      if (node.containedIn.isEmpty) {
        removeAndRepeatIfEmptyRecursively(node.parent);
      }
    } else {
      // The node might not have any list of children, but the parent can (e.g. a Block)
      removeAndRepeatIfEmptyRecursively(node.parent);
    }
  }
}

function someParent(
  node: CssNode,
  predicate: (ancestor: CssNode) => boolean,
): boolean {
  if (node.parent) {
    if (predicate(node.parent)) {
      return true;
    }
    return someParent(node.parent, predicate);
  }
  return false;
}

export function resolveAllCssVariables(node: CssNode) {
  populateParentsForNodeTree(node);
  const variableDefinitions = new Set<VariableDefinition>();
  const variableUses = new Set<VariableUse>();

  walk(node, {
    visit: 'Declaration',
    enter(declaration) {
      // Ignores @layer (properties) { ... } to avoid variable resolution conflicts
      if (
        someParent(
          declaration,
          (ancestor) =>
            ancestor.type === 'Atrule' &&
            ancestor.name === 'layer' &&
            ancestor.prelude !== null &&
            generate(ancestor.prelude).includes('properties'),
        )
      ) {
        return;
      }

      if (/--[\S]+/.test(declaration.property)) {
        variableDefinitions.add({
          declaration,
          variableName: `${declaration.property}`,
          definition: generate(declaration.value),
          remove() {
            removeAndRepeatIfEmptyRecursively(declaration);
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
    },
  });

  for (const use of variableUses) {
    let hasReplaced = false;

    for (const definition of variableDefinitions) {
      if (use.variableName !== definition.variableName) {
        continue;
      }

      if (
        use.declaration.parent?.type === 'Block' &&
        use.declaration.parent?.parent?.type === 'Atrule' &&
        use.declaration.parent.parent?.parent?.type === 'Block' &&
        use.declaration.parent.parent?.parent?.parent?.type === 'Rule' &&
        definition.declaration.parent?.type === 'Block' &&
        definition.declaration.parent?.parent?.type === 'Rule' &&
        doSelectorsIntersect(
          use.declaration.parent.parent.parent.parent.prelude,
          definition.declaration.parent.parent.prelude,
        )
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
        use.declaration.parent?.type === 'Block' &&
        use.declaration.parent?.parent?.type === 'Rule' &&
        definition.declaration.parent?.type === 'Block' &&
        definition.declaration.parent?.parent?.type === 'Rule' &&
        doSelectorsIntersect(
          use.declaration.parent.parent.prelude,
          definition.declaration.parent.parent.prelude,
        )
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

  for (const definition of variableDefinitions) {
    definition.remove();
  }
}
