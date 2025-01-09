import type { Node, Root } from 'patched-postcss';
import Declaration from 'patched-postcss/lib/declaration';
import Rule from 'patched-postcss/lib/rule';
import type AtRule from 'patched-postcss/lib/at-rule';
import { removeIfEmptyRecursively } from './remove-if-empty-recursively';

const isRule = (node: Node | undefined): node is Rule => {
  return node?.type === 'rule';
};

const isAtRule = (node: Node | undefined): node is AtRule => {
  return node?.type === 'atrule';
};

const doesNodeShareVariableWith = (
  node: Node | undefined,
  nodeToShareWith: Node | undefined,
) => {
  if (isRule(node) && isRule(nodeToShareWith)) {
    return (
      node.selector === nodeToShareWith.selector ||
      node.selector.includes('*') ||
      node.selector.includes(':root')
    );
  }

  return node === nodeToShareWith;
};

const findVariableDeclarations = (root: Root, rule: Rule, variable: string) => {
  const variableDeclarations = new Set<Declaration>();
  root.walkDecls((declaration) => {
    if (/--[^\s]+/.test(declaration.prop)) {
      if (
        `var(${declaration.prop})` === variable &&
        doesNodeShareVariableWith(declaration.parent, rule)
      ) {
        variableDeclarations.add(declaration);
      }
    }
  });
  return variableDeclarations;
};

export const resolveAllCSSVariables = (root: Root) => {
  root.walkRules((rule) => {
    const declarationsForAtRules = new Map<AtRule, Set<Declaration>>();
    const valueReplacingInformation = new Set<{
      declaration: Declaration;
      newValue: string;
    }>();

    rule.walkDecls((declaration) => {
      if (/var\(--[^\s)]+\)/.test(declaration.value)) {
        /**
         * @example ['var(--width)', 'var(--length)']
         */
        const variablesUsed = [
          ...(/var\(--[^\s)]+\)/gm.exec(declaration.value) ?? []),
        ];
        for (const variableUsed of variablesUsed) {
          const variableDeclarations = findVariableDeclarations(
            root,
            rule,
            variableUsed,
          );

          for (const variableDeclaration of variableDeclarations) {
            if (
              variableDeclaration.parent &&
              isAtRule(variableDeclaration.parent.parent) &&
              variableDeclaration.parent !== rule
            ) {
              const atRule = variableDeclaration.parent.parent;

              const declarationWithoutVariable = new Declaration({
                important: declaration.important,
                prop: declaration.prop,
                value: declaration.value.replaceAll(
                  variableUsed,
                  variableDeclaration.value,
                ),
              });

              const declarationForAtRule = declarationsForAtRules.get(atRule);
              if (declarationForAtRule) {
                declarationForAtRule.add(declarationWithoutVariable);
              } else {
                declarationsForAtRules.set(
                  atRule,
                  new Set([declarationWithoutVariable]),
                );
              }
              break;
            } else {
              valueReplacingInformation.add({
                declaration,
                newValue: declaration.value.replaceAll(
                  variableUsed,
                  variableDeclaration.value,
                ),
              });
            }
          }
        }
      }
    });

    for (const { declaration, newValue } of valueReplacingInformation) {
      declaration.value = newValue;
    }

    for (const [atRule, declarations] of declarationsForAtRules.entries()) {
      const equivalentRule = new Rule({
        selector: rule.selector,
        selectors: rule.selectors,
        nodes: [...declarations],
      });
      atRule.append(equivalentRule);
    }
  });

  root.walkDecls((decl) => {
    if (/--[^\s]+/.test(decl.prop)) {
      const parent = decl.parent;
      decl.remove();
      if (parent) {
        removeIfEmptyRecursively(parent);
      }
    }
  });

  return root;
};
