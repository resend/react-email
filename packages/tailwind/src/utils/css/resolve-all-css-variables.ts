/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  type Container,
  type Root,
  type Document,
  type Node,
  type Declaration,
  Rule,
  rule as createRule,
  decl as createDeclaration,
  AtRule,
} from "postcss";

const removeIfEmptyRecursively = (node: Container | Document) => {
  if (node.first === undefined) {
    const parent = node.parent;
    if (parent) {
      node.remove();
      removeIfEmptyRecursively(parent);
    }
  }
};

const doNodesMatch = (first: Node | undefined, second: Node | undefined) => {
  if (first instanceof Rule && second instanceof Rule) {
    return (
      first.selector === second.selector ||
      second.selector.includes("*") ||
      second.selector.includes(":root")
    );
  }

  return first === second;
};

export const resolveAllCSSVariables = (root: Root) => {
  root.walkRules((rule) => {
    const declarationsForAtRules = new Map<AtRule, Set<Declaration>>();
    const valueReplacingInformation = new Set<{
      declaration: Declaration;
      newValue: string;
    }>();

    rule.walkDecls((decl) => {
      if (/var\(--[^\s)]+\)/.test(decl.value)) {
        /**
         * @example ['var(--width)', 'var(--length)']
         */
        const variablesUsed = /var\(--[^\s)]+\)/gm.exec(decl.value)!;
        root.walkDecls((otherDecl) => {
          if (/--[^\s]+/.test(otherDecl.prop)) {
            const variable = `var(${otherDecl.prop})`;
            if (
              variablesUsed.includes(variable) &&
              doNodesMatch(decl.parent, otherDecl.parent)
            ) {
              if (
                otherDecl.parent?.parent instanceof AtRule &&
                otherDecl.parent !== decl.parent
              ) {
                const atRule = otherDecl.parent.parent;

                const clonedDeclaration = createDeclaration();
                clonedDeclaration.prop = decl.prop;
                clonedDeclaration.value = decl.value.replaceAll(
                  variable,
                  otherDecl.value,
                );
                clonedDeclaration.important = decl.important;
                if (declarationsForAtRules.has(atRule)) {
                  declarationsForAtRules
                    .get(otherDecl.parent.parent)!
                    .add(clonedDeclaration);
                } else {
                  declarationsForAtRules.set(
                    otherDecl.parent.parent,
                    new Set([clonedDeclaration]),
                  );
                }
                return;
              }

              valueReplacingInformation.add({
                declaration: decl,
                newValue: decl.value.replaceAll(variable, otherDecl.value),
              });
            }
          }
        });
      }
    });

    for (const { declaration, newValue } of valueReplacingInformation) {
      declaration.value = newValue;
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
