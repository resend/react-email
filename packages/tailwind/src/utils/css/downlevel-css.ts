import { type CssNode, clone, List, type StyleSheet, walk } from 'css-tree';

/**
 * Converts modern CSS features (range media queries, CSS nesting) into
 * legacy-compatible CSS for email client support.
 *
 * Transforms:
 * - `@media (width>=40rem)` → `@media (min-width:40rem)`
 * - `.cls{@media ...{decls}}` → `@media ...{.cls{decls}}`
 * - `&:hover` → resolved with parent selector
 */
export function downlevelCss(ast: StyleSheet) {
  convertFeatureRanges(ast);
  unnestRules(ast);
}

const rangeToFeatureName: Record<string, string> = {
  '>=': 'min-',
  '>': 'min-',
  '<=': 'max-',
  '<': 'max-',
};

/**
 * Converts FeatureRange nodes (e.g. `width >= 40rem`) into
 * Feature nodes (e.g. `min-width: 40rem`).
 */
function convertFeatureRanges(ast: CssNode) {
  walk(ast, {
    enter(node, item, list) {
      if (node.type !== 'FeatureRange' || !list) return;

      const prefix = rangeToFeatureName[node.leftComparison];
      if (!prefix) return;

      const featureName = node.left.type === 'Identifier' ? node.left.name : '';
      if (!featureName) return;

      const feature: CssNode = {
        type: 'Feature',
        kind: node.kind,
        name: `${prefix}${featureName}`,
        value: node.middle,
      } as CssNode;

      list.replace(item, list.createItem(feature));
    },
  });
}

interface RuleNode {
  type: 'Rule';
  prelude: CssNode;
  block: { type: 'Block'; children: List<CssNode> };
}

interface AtruleNode {
  type: 'Atrule';
  name: string;
  prelude: CssNode;
  block: { type: 'Block'; children: List<CssNode> };
}

/**
 * Flattens CSS nesting: hoists @media out of rules and resolves `&`.
 *
 * Input:  `.cls { @media (...) { &:hover { color: red } } }`
 * Output: `@media (...) { .cls:hover { color: red } }`
 */
function unnestRules(ast: StyleSheet) {
  const newChildren = new List<CssNode>();

  for (const node of ast.children.toArray()) {
    if (node.type === 'Rule') {
      const flattened = flattenRule(node as RuleNode);
      for (const flatNode of flattened) {
        newChildren.appendData(flatNode);
      }
    } else {
      newChildren.appendData(node);
    }
  }

  ast.children = newChildren;
}

/**
 * Recursively flattens a rule's block, producing top-level nodes.
 * Declarations stay in a rule with the parent selector.
 * Nested @media and rules with & are hoisted.
 */
function flattenRule(rule: RuleNode): CssNode[] {
  const result: CssNode[] = [];
  const declarations: CssNode[] = [];

  for (const child of rule.block.children.toArray()) {
    if (child.type === 'Declaration') {
      declarations.push(child);
    } else if (child.type === 'Atrule') {
      const atrule = child as unknown as AtruleNode;
      const innerNodes = flattenBlockWithSelector(
        rule.prelude,
        atrule.block.children,
      );
      for (const inner of innerNodes) {
        result.push({
          type: 'Atrule',
          name: atrule.name,
          prelude: clone(atrule.prelude),
          block: {
            type: 'Block',
            children: new List<CssNode>().fromArray([inner]),
          },
        } as CssNode);
      }
    } else if (child.type === 'Rule') {
      const nestedRule = child as unknown as RuleNode;
      const resolvedPrelude = resolveNesting(rule.prelude, nestedRule.prelude);
      const innerFlattened = flattenRule({
        ...nestedRule,
        prelude: resolvedPrelude,
      } as RuleNode);
      result.push(...innerFlattened);
    }
  }

  if (declarations.length > 0) {
    result.unshift({
      type: 'Rule',
      prelude: clone(rule.prelude),
      block: {
        type: 'Block',
        children: new List<CssNode>().fromArray(declarations),
      },
    } as CssNode);
  }

  return result;
}

/**
 * Processes children of an @media block, wrapping declarations/rules
 * with the parent selector.
 */
function flattenBlockWithSelector(
  parentPrelude: CssNode,
  children: List<CssNode>,
): CssNode[] {
  const result: CssNode[] = [];
  const declarations: CssNode[] = [];

  for (const child of children.toArray()) {
    if (child.type === 'Declaration') {
      declarations.push(child);
    } else if (child.type === 'Rule') {
      const nestedRule = child as unknown as RuleNode;
      const resolvedPrelude = resolveNesting(parentPrelude, nestedRule.prelude);
      const innerFlattened = flattenRule({
        ...nestedRule,
        prelude: resolvedPrelude,
      } as RuleNode);
      result.push(...innerFlattened);
    } else if (child.type === 'Atrule') {
      const atrule = child as unknown as AtruleNode;
      const innerNodes = flattenBlockWithSelector(
        parentPrelude,
        atrule.block.children,
      );
      for (const inner of innerNodes) {
        result.push({
          type: 'Atrule',
          name: atrule.name,
          prelude: clone(atrule.prelude),
          block: {
            type: 'Block',
            children: new List<CssNode>().fromArray([inner]),
          },
        } as CssNode);
      }
    }
  }

  if (declarations.length > 0) {
    result.unshift({
      type: 'Rule',
      prelude: clone(parentPrelude),
      block: {
        type: 'Block',
        children: new List<CssNode>().fromArray(declarations),
      },
    } as CssNode);
  }

  return result;
}

/**
 * Resolves `&` (NestingSelector) in a nested selector by replacing it
 * with the parent selector's content.
 */
function resolveNesting(
  parentPrelude: CssNode,
  nestedPrelude: CssNode,
): CssNode {
  const resolved = clone(nestedPrelude);

  walk(resolved, {
    enter(node, item, list) {
      if (node.type !== 'NestingSelector' || !list) return;

      const parentSelectors = getFirstSelectorChildren(parentPrelude);
      if (!parentSelectors) return;

      const clonedParent = parentSelectors.map((n) => clone(n));

      let current = item;
      for (const parentNode of clonedParent) {
        list.insertData(parentNode, current);
        current = current.prev!;
      }
      list.remove(item);
    },
  });

  return resolved;
}

/**
 * Gets the children of the first Selector in a SelectorList prelude.
 */
function getFirstSelectorChildren(prelude: CssNode): CssNode[] | null {
  if (prelude.type === 'SelectorList') {
    const first = prelude.children.first;
    if (first?.type === 'Selector') {
      return first.children.toArray();
    }
  }
  if (prelude.type === 'Selector') {
    return prelude.children.toArray();
  }
  return null;
}
