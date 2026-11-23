import {
  type CssNode,
  type Declaration,
  generate,
  type List,
  type ListItem,
  parse,
  type Raw,
  type Rule,
  type SelectorList,
  type Value,
  walk,
} from 'css-tree';
import { NON_INLINABLE_ATRULES } from './constants.js';
import { isRuleInlinable } from './is-rule-inlinable.js';

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
}

function hasUniversalSelector(
  selector: SelectorList | Raw,
  includeRoot: boolean,
): boolean {
  let hasSomeUniversal = false;
  const walker = (
    node: CssNode,
    _parentListItem: ListItem<CssNode>,
    parentList: List<CssNode>,
  ) => {
    if (hasSomeUniversal) return;
    if (
      includeRoot &&
      node.type === 'PseudoClassSelector' &&
      node.name === 'root'
    ) {
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
  walk(selector, walker);
  return hasSomeUniversal;
}

function doSelectorsIntersect(
  first: SelectorList | Raw,
  second: SelectorList | Raw,
): boolean {
  return (
    generate(first) === generate(second) ||
    hasUniversalSelector(first, true) ||
    hasUniversalSelector(second, true)
  );
}

function isSingleClassSelector(selector: SelectorList | Raw) {
  const [only, ...rest] =
    selector.type === 'SelectorList' ? selector.children.toArray() : [];
  return (
    rest.length === 0 &&
    only?.type === 'Selector' &&
    only.children.size === 1 &&
    only.children.first?.type === 'ClassSelector'
  );
}

function getClassRule(path: CssNode[]) {
  const [block, rule] = path;
  if (
    block?.type !== 'Block' ||
    rule?.type !== 'Rule' ||
    !isSingleClassSelector(rule.prelude) ||
    !isRuleInlinable(rule) ||
    path.some(
      (ancestor) =>
        ancestor.type === 'Atrule' &&
        NON_INLINABLE_ATRULES.has(ancestor.name.toLowerCase()),
    )
  ) {
    return undefined;
  }
  return rule;
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
          });
        }

        // Custom properties can reference other variables too, e.g. Tailwind's
        // `--tw-gradient-from: var(--color-red-500)`, which is only read later
        // through `var(--tw-gradient-from)` when inlining. css-tree keeps their
        // values as Raw, so they need parsing before their var()s can be found.
        function parseVariableUsesFrom(node: CssNode) {
          walk(node, {
            visit: 'Function',
            enter(funcNode) {
              if (funcNode.name === 'var') {
                const children = funcNode.children.toArray();
                const name = generate(children[0]!);
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

        parseVariableUsesFrom(
          declaration.value.type === 'Raw'
            ? parse(declaration.value.value, { context: 'value' })
            : declaration.value,
        );
      }
      path.unshift(node);
    },
  });

  const localDefinitions = new Map<CssNode, Map<string, VariableDefinition>>();
  for (const definition of variableDefinitions) {
    const block = definition.path[0];
    if (!block) continue;
    let definitions = localDefinitions.get(block);
    if (!definitions) {
      definitions = new Map();
      localDefinitions.set(block, definitions);
    }
    const previous = definitions.get(definition.variableName);
    if (!previous?.declaration.important || definition.declaration.important) {
      definitions.set(definition.variableName, definition);
    }
  }

  const definingClassRules = new Map<string, Rule[]>();
  for (const definition of variableDefinitions) {
    const rule = getClassRule(definition.path);
    if (!rule) continue;
    let rules = definingClassRules.get(definition.variableName);
    if (!rules) {
      rules = [];
      definingClassRules.set(definition.variableName, rules);
    }
    rules.push(rule);
  }

  for (const use of variableUses) {
    let hasReplaced = false;
    const localDefinition = use.path[0]
      ? localDefinitions.get(use.path[0])?.get(use.variableName)
      : undefined;
    const useRule = use.path.find((ancestor) => ancestor.type === 'Rule');
    const useClassRule = getClassRule(use.path);
    const mayBeDefinedByOtherClass =
      useClassRule !== undefined &&
      (definingClassRules.get(use.variableName) ?? []).some(
        (rule) => !doSelectorsIntersect(useClassRule.prelude, rule.prelude),
      );

    for (const definition of variableDefinitions) {
      if (use.variableName !== definition.variableName) {
        continue;
      }

      if (localDefinition && definition !== localDefinition) {
        const definitionRule = definition.path.find(
          (ancestor) => ancestor.type === 'Rule',
        );
        // A root default is inherited, but an important declaration on the
        // same selector or a bare universal selector applies directly.
        const appliesDirectly =
          definitionRule &&
          useRule &&
          (generate(definitionRule.prelude) === generate(useRule.prelude) ||
            hasUniversalSelector(definitionRule.prelude, false));
        if (
          localDefinition.declaration.important ||
          !definition.declaration.important ||
          !appliesDirectly
        ) {
          continue;
        }
      }

      if (
        use.path[0]?.type === 'Block' &&
        use.path[1]?.type === 'Atrule' &&
        use.path[2]?.type === 'Block' &&
        use.path[3]?.type === 'Rule' &&
        definition.path[0]!.type === 'Block' &&
        definition.path[1]!.type === 'Rule' &&
        doSelectorsIntersect(use.path[3].prelude, definition.path[1].prelude)
      ) {
        use.declaration.value = parse(
          generate(use.declaration.value).replaceAll(
            use.raw,
            generate(definition.declaration.value),
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
            generate(definition.declaration.value),
          ),
          {
            context: 'value',
          },
        ) as Raw | Value;
        hasReplaced = true;
        break;
      }

      // Both use and definition live inside the same nested @media (or other
      // at-rule) block of the same rule — e.g. Tailwind v4's
      //   .print_invert { @media print { --tw-invert: invert(100%); filter: var(--tw-invert,) ... } }
      // The previous two checks only cover a Rule directly containing the
      // declaration; this one covers Rule → Block → Atrule → Block → Declaration
      // on both sides.
      if (
        use.path[0]?.type === 'Block' &&
        use.path[1]?.type === 'Atrule' &&
        use.path[2]?.type === 'Block' &&
        use.path[3]?.type === 'Rule' &&
        definition.path[0]?.type === 'Block' &&
        definition.path[1]?.type === 'Atrule' &&
        definition.path[2]?.type === 'Block' &&
        definition.path[3]?.type === 'Rule' &&
        use.path[1].name === definition.path[1].name &&
        (use.path[1].prelude
          ? definition.path[1].prelude
            ? generate(use.path[1].prelude) ===
              generate(definition.path[1].prelude)
            : false
          : definition.path[1].prelude === null) &&
        doSelectorsIntersect(use.path[3].prelude, definition.path[3].prelude)
      ) {
        use.declaration.value = parse(
          generate(use.declaration.value).replaceAll(
            use.raw,
            generate(definition.declaration.value),
          ),
          {
            context: 'value',
          },
        ) as Raw | Value;
        hasReplaced = true;
        break;
      }
    }

    // A custom property's own fallback is left in place, since a declaration
    // on the element's other classes might still define the variable when
    // the styles are inlined.
    if (
      !hasReplaced &&
      use.fallback &&
      !use.declaration.property.startsWith('--') &&
      !mayBeDefinedByOtherClass
    ) {
      use.declaration.value = parse(
        generate(use.declaration.value).replaceAll(use.raw, use.fallback),
        { context: 'value' },
      ) as Raw | Value;
    }
  }
}
