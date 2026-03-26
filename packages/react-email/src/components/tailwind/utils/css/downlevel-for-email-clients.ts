/**
 * Downlevels modern CSS features that email clients don't support,
 * operating on a css-tree StyleSheet AST.
 *
 * 1. CSS Nesting: unnests @media rules from inside selectors
 *    `.sm_p-4{@media (min-width:40rem){padding:1rem!important}}`
 *    → `@media (min-width:40rem){.sm_p-4{padding:1rem!important}}`
 *
 * 2. Media Queries Level 4 range syntax → legacy min-width/max-width
 *    `(width>=40rem)` → `(min-width:40rem)`
 *
 * Gmail, Outlook, Yahoo, and most email clients don't support either feature.
 * See: https://www.caniemail.com/features/css-at-media/
 *      https://www.caniemail.com/features/css-nesting/
 */

import {
  type Atrule,
  type CssNode,
  type ListItem,
  type Rule,
  type StyleSheet,
  clone,
  List,
  walk,
} from 'css-tree';

/**
 * Unnest @media at-rules from inside regular rules, and downlevel
 * range media query syntax to legacy min-width/max-width.
 *
 * Mutates the stylesheet in place.
 */
export function downlevelForEmailClients(styleSheet: StyleSheet): void {
  unnestMediaQueries(styleSheet);
  downlevelRangeMediaQueries(styleSheet);
}

// ---------------------------------------------------------------------------
// Unnesting
// ---------------------------------------------------------------------------

interface UnnestTransform {
  parentRule: Rule;
  parentItem: ListItem<CssNode>;
  parentList: List<CssNode>;
  nestedAtrules: Atrule[];
  remainingChildren: CssNode[];
}

/**
 * Walk the stylesheet and unnest any @media/@supports rules that are nested
 * inside regular rules. For each, the parent Rule's selector wraps the
 * at-rule's body.
 *
 * Before: `.sm_p-4 { @media (...) { padding: 1rem } }`
 * After:  `@media (...) { .sm_p-4 { padding: 1rem } }`
 */
function unnestMediaQueries(styleSheet: StyleSheet): void {
  const transforms: UnnestTransform[] = [];

  styleSheet.children.forEach(function (node, item, list) {
    if (node.type !== 'Rule' || !node.block) return;

    const nestedAtrules: Atrule[] = [];
    const remainingChildren: CssNode[] = [];

    node.block.children.forEach((child) => {
      if (
        child.type === 'Atrule' &&
        (child.name === 'media' || child.name === 'supports')
      ) {
        nestedAtrules.push(child);
      } else {
        remainingChildren.push(child);
      }
    });

    if (nestedAtrules.length > 0) {
      transforms.push({
        parentRule: node,
        parentItem: item,
        parentList: list,
        nestedAtrules,
        remainingChildren,
      });
    }
  });

  // Apply in reverse so list positions stay valid
  for (let i = transforms.length - 1; i >= 0; i--) {
    const {
      parentRule,
      parentItem,
      parentList,
      nestedAtrules,
      remainingChildren,
    } = transforms[i];

    // Build replacement list: [modified parent rule (if any), unnested @media rules...]
    const replacements = new List<CssNode>();

    if (remainingChildren.length > 0) {
      parentRule.block.children = new List<CssNode>().fromArray(
        remainingChildren,
      );
      replacements.appendData(parentRule);
    }

    for (const atrule of nestedAtrules) {
      const wrappedRule: Rule = {
        type: 'Rule',
        prelude: clone(parentRule.prelude) as Rule['prelude'],
        block: {
          type: 'Block',
          children: atrule.block
            ? atrule.block.children
            : new List<CssNode>(),
        },
      };

      const newAtrule: Atrule = {
        type: 'Atrule',
        name: atrule.name,
        prelude: atrule.prelude,
        block: {
          type: 'Block',
          children: new List<CssNode>().fromArray([wrappedRule]),
        },
      };

      replacements.appendData(newAtrule);
    }

    // Replace the original rule with the entire list of new nodes
    parentList.replace(parentItem, replacements);
  }
}

// ---------------------------------------------------------------------------
// Range media query downleveling
// ---------------------------------------------------------------------------

/**
 * Walk all @media at-rules and downlevel range syntax in their preludes.
 *
 * css-tree 3.x parses `(width >= 40rem)` as a `FeatureRange` node:
 *   { type: "FeatureRange", left: Identifier("width"), leftComparison: ">=", middle: Dimension("40rem") }
 *
 * We convert these to `Feature` nodes (legacy syntax):
 *   { type: "Feature", name: "min-width", value: Dimension("40rem") }
 */
function downlevelRangeMediaQueries(styleSheet: StyleSheet): void {
  const replacements: Array<{
    item: ListItem<CssNode>;
    replacement: CssNode;
  }> = [];

  // FeatureRange is a css-tree 3.x node type not yet in @types/css-tree
  walk(styleSheet, {
    enter(node: CssNode, item: ListItem<CssNode>) {
      if ((node.type as string) === 'FeatureRange' && item) {
        const replacement = downlevelFeatureRange(node);
        if (replacement) {
          replacements.push({ item, replacement });
        }
      }
    },
  });

  for (const { item, replacement } of replacements) {
    item.data = replacement;
  }
}

/**
 * Convert a FeatureRange node to a Feature node (legacy min-/max- syntax).
 */
function downlevelFeatureRange(node: CssNode): CssNode | null {
  if ((node.type as string) !== 'FeatureRange') return null;

  // css-tree's FeatureRange: { left, leftComparison, middle, rightComparison, right }
  // For `width >= 40rem`: left=Identifier("width"), leftComparison=">=", middle=Dimension("40","rem")
  const range = node as CssNode & {
    left: CssNode | null;
    leftComparison: string | null;
    middle: CssNode | null;
  };

  if (!range.left || !range.leftComparison || !range.middle) return null;

  const featureName =
    range.left.type === 'Identifier'
      ? (range.left as CssNode & { name: string }).name
      : null;
  if (!featureName) return null;

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
    loc: null,
    kind: 'media',
    name: `${prefix}${featureName}`,
    value: range.middle,
  } as unknown as CssNode;
}
