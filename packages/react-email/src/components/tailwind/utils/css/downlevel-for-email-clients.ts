/**
 * Downlevels modern CSS features that email clients don't support,
 * operating on a css-tree StyleSheet AST.
 *
 * 1. CSS Nesting: flattens nested rules and at-rules so no rule contains
 *    anything but declarations
 *    `.x{&:hover{@media (hover:hover){color:red}}}`
 *    → `@media (hover:hover){.x:hover{color:red}}`
 *
 * 2. Media Queries Level 4 range syntax → legacy min-width/max-width
 *    `(width>=40rem)` → `(min-width:40rem)`
 *
 * Gmail, Outlook, Yahoo, and most email clients don't support either feature.
 * Gmail drops the whole <style> when it finds nesting, not just the nested rule.
 * See: https://www.caniemail.com/features/css-at-media/
 *      https://www.caniemail.com/features/css-nesting/
 */

import {
  type Atrule,
  type CssNode,
  clone,
  type Feature,
  type FeatureRange,
  List,
  type ListItem,
  type Rule,
  type Selector,
  type SelectorList,
  type StyleSheet,
  walk,
} from 'css-tree';

/**
 * css-tree 3.x introduced new AST node types for query-related at-rules that
 * `@types/css-tree` (still on 2.x at the time of writing) doesn't expose.
 * Augmenting the module here lets the rest of this file work with strong
 * types instead of scattering `as` casts everywhere.
 *
 * - `FeatureRange` is what the parser emits for Media Queries Level 4 range
 *   syntax: `(width >= 40rem)`.
 * - `Feature` is the legacy form (`(min-width: 40rem)`) we construct as the
 *   downleveled output.
 * - `Condition` holds the features of a media query, joined by `and`, `or`
 *   or `not` identifiers.
 *
 * Note: we cannot extend the `CssNode` union itself (it's a `type` alias, not
 * an interface), and v2's `MediaQuery` has a `children` list instead of v3's
 * fields, so a few narrow casts remain in this file:
 *   1. Widening `node` inside `walk()` so we can narrow against
 *      `FeatureRange.type` (`CssNode` doesn't list `'FeatureRange'`).
 *   2. Assigning a constructed `Feature` back to `ListItem<CssNode>.data`.
 *   3. Reading and writing v3 `MediaQuery` nodes as `MediaQueryNode`.
 *
 * All are flagged inline and reference back to this block.
 *
 * See:
 *   https://github.com/csstree/csstree/blob/master/lib/syntax/node/FeatureRange.js
 *   https://github.com/csstree/csstree/blob/master/lib/syntax/node/Feature.js
 *   https://github.com/csstree/csstree/blob/master/lib/syntax/node/MediaQuery.js
 */
declare module 'css-tree' {
  interface FeatureRange extends CssNodeCommon {
    type: 'FeatureRange';
    kind: string;
    left: CssNode;
    leftComparison: string;
    middle: CssNode;
    rightComparison: string | null;
    right: CssNode | null;
  }

  interface Feature extends CssNodeCommon {
    type: 'Feature';
    kind: string;
    name: string;
    value: CssNode | null;
  }

  interface Condition extends CssNodeCommon {
    type: 'Condition';
    kind: string;
    children: List<CssNode>;
  }
}

interface MediaQueryNode {
  type: 'MediaQuery';
  modifier: 'not' | 'only' | null;
  mediaType: string | null;
  condition: import('css-tree').Condition | null;
}

/**
 * Flatten CSS nesting, and downlevel range media query syntax to legacy
 * min-width/max-width.
 *
 * Mutates the stylesheet in place.
 */
export function downlevelForEmailClients(styleSheet: StyleSheet): void {
  flattenNesting(styleSheet);
  downlevelRangeMediaQueries(styleSheet);
}

// ---------------------------------------------------------------------------
// Flattening
// ---------------------------------------------------------------------------

/**
 * Rewrite every nested rule or at-rule as a rule that only holds
 * declarations, wrapped in the at-rules it was nested in. Nodes without any
 * nesting are left untouched.
 *
 * Before: `.x { &:hover { @media (hover:hover) { color: red } } }`
 * After:  `@media (hover:hover) { .x:hover { color: red } }`
 */
function flattenNesting(styleSheet: StyleSheet): void {
  const flattened = new List<CssNode>();

  styleSheet.children.forEach((node) => {
    if (isFlattenable(node) && containsNesting(node)) {
      flattened.appendList(
        new List<CssNode>().fromArray(flattenNode(node, null, [])),
      );
    } else {
      flattened.appendData(node);
    }
  });

  styleSheet.children = flattened;
}

function containsNesting(node: CssNode): boolean {
  let found = false;
  walk(node, {
    visit: 'Rule',
    enter(rule) {
      if (rule.block.children.some(isFlattenable)) {
        found = true;
      }
    },
  });
  return found;
}

function isFlattenable(node: CssNode): node is Rule | Atrule {
  if (node.type === 'Rule') {
    return node.prelude.type === 'SelectorList';
  }
  // Any block at-rule, not just @media and @supports: Tailwind also nests
  // @container (`@sm:`) and @starting-style (`starting:`) inside rules.
  return node.type === 'Atrule' && node.block !== null;
}

function flattenNode(
  node: Rule | Atrule,
  parentSelector: SelectorList | null,
  atrules: Atrule[],
): CssNode[] {
  if (node.type === 'Rule') {
    const selector = node.prelude as SelectorList;
    return flattenBlock(
      node.block.children,
      parentSelector
        ? resolveNestedSelector(selector, parentSelector)
        : selector,
      atrules,
    );
  }

  return flattenBlock(node.block?.children ?? new List(), parentSelector, [
    ...atrules,
    node,
  ]);
}

function flattenBlock(
  children: List<CssNode>,
  selector: SelectorList | null,
  atrules: Atrule[],
): CssNode[] {
  const output: CssNode[] = [];
  // Declarations are grouped per run so their order relative to nested
  // rules is kept: `.a{color:red;&:hover{…};color:blue}` → three rules.
  let declarations: CssNode[] = [];

  const flushDeclarations = () => {
    if (declarations.length === 0) return;
    const content: CssNode[] = selector
      ? [
          {
            type: 'Rule',
            prelude: clone(selector) as SelectorList,
            block: {
              type: 'Block',
              children: new List<CssNode>().fromArray(declarations),
            },
          },
        ]
      : declarations;
    output.push(...wrapInAtrules(content, atrules));
    declarations = [];
  };

  children.forEach((child) => {
    if (isFlattenable(child)) {
      flushDeclarations();
      output.push(...flattenNode(child, selector, atrules));
    } else {
      declarations.push(child);
    }
  });
  flushDeclarations();

  return output;
}

/**
 * Replace each `&` with the parent selector. Following CSS Nesting, a parent
 * selector list becomes `:is(…)`. css-tree only parses nested rules that use
 * `&`, so there's no implicit-descendant case to handle.
 */
function resolveNestedSelector(
  nested: SelectorList,
  parent: SelectorList,
): SelectorList {
  const resolved = clone(nested) as SelectorList;
  const parentNodes = (): List<CssNode> => {
    const [onlySelector] = parent.children.toArray();
    if (parent.children.size === 1 && onlySelector?.type === 'Selector') {
      return (clone(onlySelector) as Selector).children;
    }
    return new List<CssNode>().fromArray([
      {
        type: 'PseudoClassSelector',
        name: 'is',
        children: new List<CssNode>().fromArray([clone(parent)]),
      },
    ]);
  };

  walk(resolved, (node, item, list) => {
    if (node.type === 'NestingSelector') {
      list.replace(item, parentNodes());
    }
  });

  return resolved;
}

function wrapInAtrules(content: CssNode[], atrules: Atrule[]): CssNode[] {
  return combineStackedMedia(atrules).reduceRight<CssNode[]>(
    (children, atrule) => [
      {
        type: 'Atrule',
        name: atrule.name,
        prelude: atrule.prelude
          ? (clone(atrule.prelude) as Atrule['prelude'])
          : null,
        block: {
          type: 'Block',
          children: new List<CssNode>().fromArray(children),
        },
      },
    ],
    content,
  );
}

/**
 * Merge directly stacked `@media` rules into one with `and`, as Tailwind
 * stacks them for variants like `sm:dark:`. Only merges when the result is
 * valid, the rest stay as separate at-rules, which is still valid CSS.
 */
function combineStackedMedia(atrules: Atrule[]): Atrule[] {
  const combined: Atrule[] = [];

  for (const atrule of atrules) {
    const previous = combined.at(-1);
    const outer = previous ? singleMediaQuery(previous) : null;
    const inner = singleMediaQuery(atrule);
    const merged = outer && inner ? mergeMediaQueries(outer, inner) : null;

    if (merged) {
      combined[combined.length - 1] = mediaAtrule(merged);
    } else {
      combined.push(atrule);
    }
  }

  return combined;
}

function singleMediaQuery(atrule: Atrule): MediaQueryNode | null {
  if (
    atrule.name.toLowerCase() !== 'media' ||
    atrule.prelude?.type !== 'AtrulePrelude' ||
    atrule.prelude.children.size !== 1
  ) {
    return null;
  }

  const queryList = atrule.prelude.children.first;
  if (queryList?.type !== 'MediaQueryList' || queryList.children.size !== 1) {
    return null;
  }

  // See module augmentation above: v3 `MediaQuery` fields.
  return queryList.children.first as unknown as MediaQueryNode;
}

/**
 * `print and (a)` joined with `(b)` is `print and (a) and (b)`, but `not`,
 * `or` and two media types can't be joined with `and` without changing the
 * meaning or producing an invalid query.
 */
function mergeMediaQueries(
  outer: MediaQueryNode,
  inner: MediaQueryNode,
): MediaQueryNode | null {
  if (outer.modifier === 'not' || inner.modifier === 'not') return null;
  if (outer.mediaType && inner.mediaType) return null;
  if (!isAndOnlyCondition(outer) || !isAndOnlyCondition(inner)) return null;

  const typed = outer.mediaType ? outer : inner;
  const conditionNodes = [outer.condition, inner.condition]
    .filter((condition) => condition !== null)
    .map((condition) => condition.children.map((node) => clone(node)));

  return {
    type: 'MediaQuery',
    modifier: typed.modifier,
    mediaType: typed.mediaType,
    condition:
      conditionNodes.length === 0
        ? null
        : {
            type: 'Condition',
            kind: 'media',
            children: conditionNodes.reduce((joined, nodes) => {
              if (!joined.isEmpty) {
                joined.appendData({ type: 'Identifier', name: 'and' });
              }
              return joined.appendList(nodes);
            }, new List<CssNode>()),
          },
  };
}

function isAndOnlyCondition(query: MediaQueryNode): boolean {
  return !query.condition?.children.some(
    (node) =>
      node.type === 'Identifier' &&
      ['or', 'not'].includes(node.name.toLowerCase()),
  );
}

function mediaAtrule(query: MediaQueryNode): Atrule {
  return {
    type: 'Atrule',
    name: 'media',
    prelude: {
      type: 'AtrulePrelude',
      children: new List<CssNode>().fromArray([
        {
          type: 'MediaQueryList',
          // See module augmentation above: v3 `MediaQuery` fields.
          children: new List<CssNode>().fromArray([
            query as unknown as CssNode,
          ]),
        },
      ]),
    },
    block: null,
  };
}

// ---------------------------------------------------------------------------
// Range media query downleveling
// ---------------------------------------------------------------------------

/**
 * Walk all nodes and downlevel range syntax (`FeatureRange`) inside @media
 * preludes to legacy `Feature` nodes (`min-width` / `max-width`).
 */
function downlevelRangeMediaQueries(styleSheet: StyleSheet): void {
  const replacements: Array<{
    item: ListItem<CssNode>;
    replacement: Feature;
  }> = [];

  walk(styleSheet, {
    enter(originalNode, item) {
      // See module augmentation above: `CssNode` (from @types/css-tree 2.x)
      // doesn't include `FeatureRange`, so widen here to enable narrowing.
      const node = originalNode as CssNode | FeatureRange;
      if (item && node.type === 'FeatureRange') {
        const replacement = downlevelFeatureRange(node);
        if (replacement) {
          replacements.push({ item, replacement });
        }
      }
    },
  });

  for (const { item, replacement } of replacements) {
    // See module augmentation above: `Feature` is not part of the `CssNode`
    // union, so a single cast is required when handing it back to the AST.
    item.data = replacement as unknown as CssNode;
  }
}

/**
 * Convert a `FeatureRange` node to a `Feature` node (legacy min-/max- syntax).
 *
 * For `width >= 40rem`: left=Identifier("width"), leftComparison=">=", middle=Dimension("40","rem")
 * Result: { type: "Feature", name: "min-width", value: Dimension("40","rem") }
 */
function downlevelFeatureRange(range: FeatureRange): Feature | null {
  if (range.left.type !== 'Identifier') return null;

  let prefix: string;
  if (range.leftComparison === '>=' || range.leftComparison === '>') {
    prefix = 'min-';
  } else if (range.leftComparison === '<=' || range.leftComparison === '<') {
    prefix = 'max-';
  } else {
    return null;
  }

  return {
    type: 'Feature',
    kind: 'media',
    name: `${prefix}${range.left.name}`,
    value: range.middle,
  };
}
