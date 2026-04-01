import {
  type CssNode,
  type CssNodeCommon,
  type List as CssTreeList,
  clone,
  type Identifier,
  List,
  type ListItem,
  type StyleSheet,
  walk,
} from 'css-tree';

/**
 * css-tree v3 node types not yet in @types/css-tree@2.3.x.
 * These match the runtime AST shape produced by css-tree 3.1.0.
 */
interface FeatureRange extends CssNodeCommon {
  type: 'FeatureRange';
  kind: string;
  left: CssNode;
  leftComparison: '>=' | '<=' | '>' | '<';
  middle: CssNode;
  rightComparison: string | null;
  right: CssNode | null;
}

interface Feature extends CssNodeCommon {
  type: 'Feature';
  kind: string;
  name: string;
  value: CssNode;
}

interface RuleNode {
  type: 'Rule';
  prelude: CssNode;
  block: { type: 'Block'; children: CssTreeList<CssNode> };
}

interface AtruleNode {
  type: 'Atrule';
  name: string;
  prelude: CssNode;
  block: { type: 'Block'; children: CssTreeList<CssNode> };
}

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
    enter(node: CssNode, item: ListItem<CssNode>, list: CssTreeList<CssNode>) {
      if (node.type !== ('FeatureRange' as CssNode['type']) || !list) return;

      const rangeNode = node as unknown as FeatureRange;
      const prefix = rangeToFeatureName[rangeNode.leftComparison];
      if (!prefix) return;

      const featureName =
        rangeNode.left.type === 'Identifier'
          ? (rangeNode.left as Identifier).name
          : '';
      if (!featureName) return;

      const feature: Feature = {
        type: 'Feature',
        kind: rangeNode.kind,
        name: `${prefix}${featureName}`,
        value: rangeNode.middle,
      };

      list.replace(item, list.createItem(feature as unknown as CssNode));
    },
  });
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
      const flattened = flattenRule(node as unknown as RuleNode);
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
      });
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
  children: CssTreeList<CssNode>,
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
      });
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
    enter(node: CssNode, item: ListItem<CssNode>, list: CssTreeList<CssNode>) {
      if (node.type !== 'NestingSelector' || !list) return;

      const parentSelectors = getFirstSelectorChildren(parentPrelude);
      if (!parentSelectors) return;

      const clonedParent = parentSelectors.map((n) => clone(n));

      // Insert each parent token before the `&` node, keeping original order.
      for (const parentNode of clonedParent) {
        list.insertData(parentNode, item);
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
