import { AST_NODE_TYPES, type TSESTree } from "@typescript-eslint/utils";
import type {
  RuleListener,
  SourceCode,
} from "@typescript-eslint/utils/ts-eslint";
import "./tailwind-internals.d.ts";
import resolveConfig from "tailwindcss/resolveConfig.js";
import { createContext } from "tailwindcss/lib/lib/setupContextUtils";
import evalImport from "tailwindcss/lib/lib/evaluateTailwindFunctions";
import { generateRules as rawGenerateRules } from "tailwindcss/lib/lib/generateRules";
import postcss from "postcss";
import type { Root, Rule } from "postcss";

// weirdly, after compilation, tailwind default exports an object with a default property
const evaluateTailwindFunctions = evalImport.default;

/**
 * Very useful because it keeps track of variables and weather they are being used on jsx
 * elements or not to warn the user about the problems with the properties
 */
export const getRuleListenersForJSXStyleProperties = (
  isStyleDisallowed: (
    stylePropertyName: string,
    stylePropertyValue: string,
  ) => boolean,

  sourceCode: Readonly<SourceCode>,
  reportProblemFor: (
    nodeOrLocation: TSESTree.Node | TSESTree.SourceLocation,
  ) => void,
): RuleListener => {
  const accumulatedProblemPropertiesPerVariableName = new Map<
    string,
    TSESTree.Property[]
  >();

  const metadataFromPropertyNode = (node: TSESTree.Property) => {
    const [propertyName] = sourceCode
      .getText(node.key)
      .trim()
      .match(/\w+/g) ?? [""];
    const [propertyValue] = sourceCode
      .getText(node.value)
      .trim()
      .match(/[\w\s-]+/g) ?? [""];
    return [propertyName, propertyValue] as const;
  };

  const context = createContext(
    resolveConfig({
      content: [],
      corePlugins: {
        preflight: false,
      },
    }),
  );

  const generateRules = (
    classNames: string[],
  ): { root: Root; rules: Rule[] } => {
    // inspired by the tailwind LSP server
    const bigIntRuleTuples: [bigint, Rule][] = rawGenerateRules(
      new Set(classNames),
      context,
    );

    const root = postcss.root({
      nodes: bigIntRuleTuples.map(([, rule]) => rule),
    });
    evaluateTailwindFunctions(context)(root);

    const actualRules: Rule[] = [];
    root.walkRules((subRule) => {
      actualRules.push(subRule);
    });

    return {
      root,
      rules: actualRules,
    };
  };

  type Property = [name: string, value: string];

  const getTailwindStylePropertiesForClassNameAttribute = (
    classNameAttribute: string,
  ) => {
    const propertiesPerClassname = new Map<string, Property[]>();

    for (const className of classNameAttribute.split(" ")) {
      for (const rule of generateRules([className]).rules) {
        const properties = [] as Property[];
        rule.walk((node) => {
          if (node.type === "decl") {
            properties.push([node.prop, node.value]);
          }
        });
        propertiesPerClassname.set(className, properties);
      }
    }

    return propertiesPerClassname;
  };

  return {
    'JSXAttribute[name.name="className"] Literal'(node: TSESTree.Literal) {
      const classNameAttribute = node.value;
      if (typeof classNameAttribute === "string") {
        const propertiesForClassName =
          getTailwindStylePropertiesForClassNameAttribute(classNameAttribute);
        for (const [
          className,
          properties,
        ] of propertiesForClassName.entries()) {
          const start = classNameAttribute.indexOf(className) + 1;
          const end = start + className.length;

          for (const [name, value] of properties) {
            if (isStyleDisallowed(name, value)) {
              reportProblemFor({
                start: {
                  line: node.loc.start.line,
                  column: node.loc.start.column + start,
                },
                end: {
                  line: node.loc.start.line,
                  column: node.loc.start.column + end,
                },
              });
            }
          }
        }
      }
    },
    'JSXAttribute[name.name="style"] > JSXExpressionContainer ObjectExpression > Property'(
      node: TSESTree.Property,
    ) {
      const [propertyName, propertyValue] = metadataFromPropertyNode(node);
      if (isStyleDisallowed(propertyName, propertyValue)) {
        reportProblemFor(node);
      }
    },
    // we can't directly get the ObjectExpression from VariableDeclarator
    // because it can be wrapped with something like TSAsExpression
    // which might cause issues here
    "VariableDeclarator ObjectExpression > Property"(node: TSESTree.Property) {
      const [propertyName, propertyValue] = metadataFromPropertyNode(node);
      if (isStyleDisallowed(propertyName, propertyValue)) {
        const variableNode = sourceCode.getAncestors!(node).findLast(
          (ancestor) => ancestor.type === AST_NODE_TYPES.VariableDeclarator,
        ) as TSESTree.VariableDeclarator;
        const variableName = sourceCode.getText(variableNode.id);

        const lastProblemProperties =
          accumulatedProblemPropertiesPerVariableName.get(variableName) ?? [];

        accumulatedProblemPropertiesPerVariableName.set(variableName, [
          ...lastProblemProperties,
          node,
        ]);
      }
    },
    'JSXAttribute[name.name="style"] JSXExpressionContainer Identifier'(
      node: TSESTree.Identifier,
    ) {
      const dirtyStyleVariableIdentifier =
        accumulatedProblemPropertiesPerVariableName.get(node.name);
      if (typeof dirtyStyleVariableIdentifier !== "undefined") {
        for (const problem of dirtyStyleVariableIdentifier) {
          reportProblemFor(problem);
        }
      }
    },
  };
};
