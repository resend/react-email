import {
  type Atrule,
  type CssNode,
  type Rule,
  type StyleSheet,
  clone,
  generate,
  List,
  walk,
} from 'css-tree';

const REM_TO_PX = 16;

/**
 * Transforms the non-inlinable stylesheet to be compatible with email clients
 * (especially Gmail) by:
 *
 * 1. Unnesting CSS media queries — moves `@media` from inside rules to the
 *    top level, since Gmail does not support CSS nesting.
 * 2. Converting modern range syntax (`width >= 40rem`) to the legacy
 *    `min-width` / `max-width` form that Gmail understands.
 * 3. Converting `rem` units to `px` inside media query conditions.
 * 4. Resolving CSS nesting selectors (`&` → parent selector).
 * 5. Grouping rules that share the same media query into a single `@media` block.
 */
export function makeStylesEmailCompatible(styleSheet: StyleSheet): void {
  const newChildren: CssNode[] = [];

  for (const child of styleSheet.children.toArray()) {
    if (child.type === 'Rule') {
      const processed = processRule(child);
      newChildren.push(...processed);
    } else {
      newChildren.push(child);
    }
  }

  convertAllMediaQueryConditions(newChildren);

  const grouped = groupByMediaQuery(newChildren);

  styleSheet.children = new List<CssNode>().fromArray(grouped);
}

/**
 * Process a top-level Rule node. If the rule contains nested `@media` or
 * nested rules (e.g. `&:hover`), unnest them so each ends up as a proper
 * top-level construct.
 */
function processRule(rule: Rule): CssNode[] {
  const result: CssNode[] = [];
  const directDeclarations: CssNode[] = [];

  for (const child of rule.block.children.toArray()) {
    if (child.type === 'Atrule' && child.name === 'media') {
      const innerNodes = flattenNestedContent(rule, child);
      const atrule: Atrule = {
        type: 'Atrule',
        loc: null,
        name: 'media',
        prelude: clone(child.prelude) as Atrule['prelude'],
        block: {
          type: 'Block',
          loc: null,
          children: new List<CssNode>().fromArray(innerNodes),
        },
      };
      result.push(atrule);
    } else if (child.type === 'Rule') {
      const resolved = resolveNestedRule(rule, child);
      result.push(...resolved);
    } else {
      directDeclarations.push(child);
    }
  }

  if (directDeclarations.length > 0) {
    const declRule: Rule = {
      type: 'Rule',
      loc: null,
      prelude: clone(rule.prelude) as Rule['prelude'],
      block: {
        type: 'Block',
        loc: null,
        children: new List<CssNode>().fromArray(directDeclarations),
      },
    };
    result.unshift(declRule);
  }

  return result;
}

/**
 * Flatten nested content inside a `@media` block, resolving `&` selectors
 * and merging further-nested `@media` conditions.
 */
function flattenNestedContent(
  parentRule: Rule,
  mediaAtrule: Atrule,
): CssNode[] {
  if (!mediaAtrule.block) return [];

  const result: CssNode[] = [];
  const declarations: CssNode[] = [];

  for (const child of mediaAtrule.block.children.toArray()) {
    if (child.type === 'Declaration') {
      declarations.push(clone(child) as CssNode);
    } else if (child.type === 'Rule') {
      const resolved = resolveNestedRule(parentRule, child);
      result.push(...resolved);
    } else if (child.type === 'Atrule') {
      result.push(child);
    } else {
      declarations.push(clone(child) as CssNode);
    }
  }

  if (declarations.length > 0) {
    const innerRule: Rule = {
      type: 'Rule',
      loc: null,
      prelude: clone(parentRule.prelude) as Rule['prelude'],
      block: {
        type: 'Block',
        loc: null,
        children: new List<CssNode>().fromArray(declarations),
      },
    };
    result.unshift(innerRule);
  }

  return result;
}

/**
 * Resolve a nested rule (like `&:hover { ... }`) by replacing `&` with the
 * parent selector.
 */
function resolveNestedRule(parentRule: Rule, nestedRule: Rule): CssNode[] {
  const parentSelector = generate(parentRule.prelude);
  const nestedSelector = generate(nestedRule.prelude);
  const resolvedSelector = nestedSelector.replace(/&/g, parentSelector);

  const result: CssNode[] = [];
  const declarations: CssNode[] = [];

  for (const child of nestedRule.block.children.toArray()) {
    if (child.type === 'Atrule' && child.name === 'media') {
      const innerDeclarations: CssNode[] = [];
      if (child.block) {
        for (const innerChild of child.block.children.toArray()) {
          innerDeclarations.push(clone(innerChild) as CssNode);
        }
      }
      const innerRule = createRuleFromSelector(
        resolvedSelector,
        innerDeclarations,
      );
      const atrule: Atrule = {
        type: 'Atrule',
        loc: null,
        name: 'media',
        prelude: clone(child.prelude) as Atrule['prelude'],
        block: {
          type: 'Block',
          loc: null,
          children: new List<CssNode>().fromArray([innerRule]),
        },
      };
      result.push(atrule);
    } else if (child.type === 'Rule') {
      const resolved = resolveNestedRule(
        { ...parentRule, prelude: nestedRule.prelude } as Rule,
        child,
      );
      result.push(...resolved);
    } else {
      declarations.push(clone(child) as CssNode);
    }
  }

  if (declarations.length > 0) {
    const resolvedRule = createRuleFromSelector(
      resolvedSelector,
      declarations,
    );
    result.unshift(resolvedRule);
  }

  return result;
}

function createRuleFromSelector(
  selectorStr: string,
  children: CssNode[],
): Rule {
  return {
    type: 'Rule',
    loc: null,
    prelude: {
      type: 'SelectorList',
      loc: null,
      children: new List<CssNode>().fromArray([
        {
          type: 'Raw',
          loc: null,
          value: selectorStr,
        },
      ]),
    },
    block: {
      type: 'Block',
      loc: null,
      children: new List<CssNode>().fromArray(children),
    },
  };
}

/**
 * Walk all nodes and convert `FeatureRange` (modern range syntax) to `Feature`
 * (legacy `min-width` / `max-width`). Also converts `rem` → `px`.
 */
function convertAllMediaQueryConditions(nodes: CssNode[]): void {
  for (const node of nodes) {
    walk(node, {
      visit: 'Atrule',
      enter(atrule) {
        if (atrule.name === 'media' && atrule.prelude) {
          walk(atrule.prelude, (preludeNode, item, list) => {
            if (preludeNode.type === 'FeatureRange' && item && list) {
              const feature = convertFeatureRange(preludeNode);
              if (feature) {
                item.data = feature;
              }
            }
          });
        }
      },
    });
  }
}

/**
 * Convert a `FeatureRange` node (e.g. `width >= 40rem`) into a `Feature` node
 * (e.g. `min-width: 640px`).
 */
function convertFeatureRange(range: CssNode): CssNode | null {
  if (range.type !== 'FeatureRange') return null;

  const { left, leftComparison, middle } = range;

  if (left?.type !== 'Identifier' || !middle) return null;

  const featureName = left.name;
  const comparison = leftComparison;

  let value = middle;

  if (middle.type === 'Dimension' && middle.unit === 'rem') {
    const pxValue = Number.parseFloat(middle.value) * REM_TO_PX;
    value = {
      type: 'Dimension',
      loc: null,
      value: String(pxValue),
      unit: 'px',
    };
  }

  let name: string;
  if (comparison === '>=' || comparison === '>') {
    name = `min-${featureName}`;
  } else if (comparison === '<=' || comparison === '<') {
    name = `max-${featureName}`;
    if (comparison === '<' && value.type === 'Dimension') {
      const numericValue = Number.parseFloat(value.value) - 0.02;
      value = {
        type: 'Dimension',
        loc: null,
        value: String(Math.round(numericValue * 100) / 100),
        unit: value.unit,
      };
    }
  } else {
    return null;
  }

  return {
    type: 'Feature',
    loc: null,
    kind: 'media',
    name,
    value,
  };
}

/**
 * Group consecutive `@media` rules that share the same query into a single
 * `@media` block, reducing output size and improving readability.
 */
function groupByMediaQuery(nodes: CssNode[]): CssNode[] {
  const mediaGroups = new Map<string, CssNode[]>();
  const result: CssNode[] = [];
  const insertionOrder: string[] = [];

  for (const node of nodes) {
    if (node.type === 'Atrule' && node.name === 'media' && node.prelude) {
      const key = generate(node.prelude);
      if (!mediaGroups.has(key)) {
        mediaGroups.set(key, []);
        insertionOrder.push(key);
      }
      if (node.block) {
        mediaGroups
          .get(key)!
          .push(...node.block.children.toArray());
      }
    } else {
      const uniqueKey = `__non_media_${result.length}`;
      insertionOrder.push(uniqueKey);
      mediaGroups.set(uniqueKey, [node]);
    }
  }

  for (const key of insertionOrder) {
    const children = mediaGroups.get(key)!;
    if (key.startsWith('__non_media_')) {
      result.push(...children);
    } else {
      const firstMatch = nodes.find(
        (n) =>
          n.type === 'Atrule' &&
          n.name === 'media' &&
          n.prelude &&
          generate(n.prelude) === key,
      ) as Atrule;

      if (firstMatch) {
        const grouped: Atrule = {
          type: 'Atrule',
          loc: null,
          name: 'media',
          prelude: clone(firstMatch.prelude) as Atrule['prelude'],
          block: {
            type: 'Block',
            loc: null,
            children: new List<CssNode>().fromArray(children),
          },
        };
        result.push(grouped);
      }
    }
  }

  return result;
}
