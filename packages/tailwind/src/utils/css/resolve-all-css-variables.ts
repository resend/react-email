import {
  AtRule,
  type Declaration,
  type Root,
  Rule,
} from 'postcss';
import { removeIfEmptyRecursively } from './remove-if-empty-recursively';

interface VariableUse {
  declaration: Declaration;
  variable: string;
}

interface VariableDefinition {
  declaration: Declaration;
  variable: string;
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
        variable: `var(${declaration.prop})`,
        definition: declaration.value,
      });
    } else {
      const variablesUsed = [
        ...declaration.value.matchAll(/var\(--[^\s)]+\)/gm),
      ].map((match) => match.toString());

      for (const variable of variablesUsed) {
        variableUses.add({
          declaration,
          variable,
        });
      }
    }
  });

  for (const definition of variableDefinitions) {
    for (const use of variableUses) {
      if (use.variable !== definition.variable) {
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
          use.variable,
          definition.definition,
        );
        continue;
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
          use.variable,
          definition.definition,
        );
      }
    }
  }

  // root.walkRules((rule) => {
  //   const declarationsForMediaQueries = new Map<AtRule, Set<Declaration>>();
  //   const valueReplacingInformation = new Set<{
  //     declaration: Declaration;
  //     replacing: string;
  //     replacement: string;
  //   }>();
  //
  //   rule.walkDecls((declaration) => {
  //     if () {
  //       /**
  //        * @example ['var(--width)', 'var(--length)']
  //        */
  //       const variablesUsed = [
  //         ...declaration.value.matchAll(/var\(--[^\s)]+\)/gm),
  //       ].map((match) => match.toString());
  //
  //       root.walkDecls((otherDecl) => {
  //         if () {
  //           const variable = `var(${otherDecl.prop})`;
  //           if (
  //             variablesUsed?.includes(variable) &&
  //             areSelectingTheSame(declaration.parent, otherDecl.parent)
  //           ) {
  //             if (
  //               otherDecl.parent?.parent instanceof AtRule &&
  //               otherDecl.parent?.parent.name === 'media' &&
  //               otherDecl.parent !== declaration.parent
  //             ) {
  //               const atRule = otherDecl.parent.parent;
  //
  //               const clonedDeclaration = createDeclaration();
  //               clonedDeclaration.prop = declaration.prop;
  //               clonedDeclaration.value = declaration.value.replaceAll(
  //                 variable,
  //                 otherDecl.value,
  //               );
  //               clonedDeclaration.important = declaration.important;
  //
  //               const declarationForAtRule =
  //                 declarationsForMediaQueries.get(atRule);
  //               if (declarationForAtRule) {
  //                 declarationForAtRule.add(clonedDeclaration);
  //               } else {
  //                 declarationsForMediaQueries.set(
  //                   otherDecl.parent.parent,
  //                   new Set([clonedDeclaration]),
  //                 );
  //               }
  //               return;
  //             }
  //
  //             valueReplacingInformation.add({
  //               declaration,
  //               replacing: variable,
  //               replacement: otherDecl.value,
  //             });
  //           }
  //         }
  //       });
  //     }
  //   });
  //
  //   for (const {
  //     declaration,
  //     replacing,
  //     replacement,
  //   } of valueReplacingInformation) {
  //     declaration.value = declaration.value.replaceAll(replacing, replacement);
  //   }
  //
  //   for (const [
  //     atRule,
  //     declarations,
  //   ] of declarationsForMediaQueries.entries()) {
  //     const equivalentRule = createRule();
  //     equivalentRule.selector = rule.selector;
  //     equivalentRule.append(...declarations);
  //
  //     atRule.append(equivalentRule);
  //   }
  // });

  for (const definition of variableDefinitions) {
    const parent = definition.declaration.parent;
    definition.declaration.remove();
    if (parent) {
      removeIfEmptyRecursively(parent);
    }
  }

  return root;
};
