import {
  AtRule,
  decl as createDeclaration,
  rule as createRule,
  type Declaration,
  type Node,
  type Root,
  Rule,
} from 'postcss';
import { removeIfEmptyRecursively } from './remove-if-empty-recursively';

const doNodesMatch = (first: Node | undefined, second: Node | undefined) => {
  if (first instanceof Rule && second instanceof Rule) {
    return (
      first.selector === second.selector ||
      second.selector.includes('*') ||
      second.selector.includes(':root')
    );
  }

  return first === second;
};

export const resolveAllCSSVariables = (root: Root) => {
  root.walkRules((rule) => {
    const declarationsForAtRules = new Map<AtRule, Set<Declaration>>();
    const valueReplacingInformation = new Set<{
      declaration: Declaration;
      replacing: string;
      replacement: string;
    }>();

    rule.walkDecls((declaration) => {
      if (/var\(--[^\s)]+\)/.test(declaration.value)) {
        /**
         * @example ['var(--width)', 'var(--length)']
         */
        const variablesUsed = [
          ...declaration.value.matchAll(/var\(--[^\s)]+\)/gm),
        ].map((match) => match.toString());

        root.walkDecls((otherDecl) => {
          if (/--[^\s]+/.test(otherDecl.prop)) {
            const variable = `var(${otherDecl.prop})`;
            if (
              variablesUsed?.includes(variable) &&
              doNodesMatch(declaration.parent, otherDecl.parent)
            ) {
              if (
                otherDecl.parent?.parent instanceof AtRule &&
                otherDecl.parent !== declaration.parent
              ) {
                const atRule = otherDecl.parent.parent;

                const clonedDeclaration = createDeclaration();
                clonedDeclaration.prop = declaration.prop;
                clonedDeclaration.value = declaration.value.replaceAll(
                  variable,
                  otherDecl.value,
                );
                clonedDeclaration.important = declaration.important;

                const declarationForAtRule = declarationsForAtRules.get(atRule);
                if (declarationForAtRule) {
                  declarationForAtRule.add(clonedDeclaration);
                } else {
                  declarationsForAtRules.set(
                    otherDecl.parent.parent,
                    new Set([clonedDeclaration]),
                  );
                }
                return;
              }

              valueReplacingInformation.add({
                declaration,
                replacing: variable,
                replacement: otherDecl.value,
              });
            }
          }
        });
      }
    });

    for (const {
      declaration,
      replacing,
      replacement,
    } of valueReplacingInformation) {
      declaration.value = declaration.value.replaceAll(replacing, replacement);
    }

    for (const [atRule, declarations] of declarationsForAtRules.entries()) {
      const equivalentRule = createRule();
      equivalentRule.selector = rule.selector;
      equivalentRule.append(...declarations);

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
