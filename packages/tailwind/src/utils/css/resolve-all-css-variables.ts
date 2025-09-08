import {
  type CssNode,
  type Declaration,
  generate,
  List,
  parse,
  type Raw,
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

const removeAndRepeatIfEmptyRecursively = (node: CssNode) => {
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
};

export const resolveAllCSSVariables = (node: CssNode) => {
  populateParentsForNodeTree(node);
  const variableDefinitions = new Set<VariableDefinition>();
  const variableUses = new Set<VariableUse>();

  walk(node, {
    visit: 'Declaration',
    enter(declaration) {
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
          generate(use.declaration.parent.parent.parent.parent.prelude),
          generate(definition.declaration.parent.parent.prelude),
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
          generate(use.declaration.parent.parent.prelude),
          generate(definition.declaration.parent.parent.prelude),
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
};
