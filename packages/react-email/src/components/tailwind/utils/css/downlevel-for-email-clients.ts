/**
 * Downlevels modern CSS features that email clients don't support,
 * operating on a css-tree StyleSheet AST.
 *
 * 1. CSS Nesting: unnests @media rules from inside selectors
 *    `.sm_p-4{@media (min-width:40rem){padding:1rem!important}}`
 *    → `@media (min-width:40rem){.sm_p-4{padding:1rem!important}}`
 *
 *    Stacked variants (e.g. `sm:dark:bg-black`) nest @media inside @media
 *    inside the selector; those chains are flattened by combining the media
 *    conditions with `and`, which is semantically equivalent to the nesting.
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
  clone,
  type Feature,
  type FeatureRange,
  generate,
  List,
  type ListItem,
  parse,
  type Rule,
  type StyleSheet,
  walk,
} from 'css-tree';
import { NON_INLINABLE_ATRULES } from './constants.js';

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
 *
 * Note: we cannot extend the `CssNode` union itself (it's a `type` alias, not
 * an interface), so two narrow casts remain in this file:
 *   1. Widening `node` inside `walk()` so we can narrow against
 *      `FeatureRange.type` (`CssNode` doesn't list `'FeatureRange'`).
 *   2. Assigning a constructed `Feature` back to `ListItem<CssNode>.data`.
 *
 * Both are flagged inline and reference back to this block.
 *
 * See:
 *   https://github.com/csstree/csstree/blob/master/lib/syntax/node/FeatureRange.js
 *   https://github.com/csstree/csstree/blob/master/lib/syntax/node/Feature.js
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
}

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
  // Each pass hoists at-rules one level out of their parent rule. A rule
  // created by hoisting can itself still contain a nested at-rule (e.g. a
  // @supports inside a @media for stacked variants), so repeat until a pass
  // finds nothing left to hoist.
  while (unnestMediaQueriesPass(styleSheet)) {
    // keep hoisting
  }
}

function unnestMediaQueriesPass(styleSheet: StyleSheet): boolean {
  const transforms: UnnestTransform[] = [];

  walk(styleSheet, {
    visit: 'Rule',
    enter(rule, item, list) {
      if (!rule.block || !item) return;

      const nestedAtrules: Atrule[] = [];
      const remainingChildren: CssNode[] = [];

      rule.block.children.forEach((child) => {
        if (
          child.type === 'Atrule' &&
          NON_INLINABLE_ATRULES.has(child.name.toLowerCase())
        ) {
          nestedAtrules.push(child);
        } else {
          remainingChildren.push(child);
        }
      });

      if (nestedAtrules.length > 0) {
        transforms.push({
          parentRule: rule,
          parentItem: item,
          parentList: list,
          nestedAtrules,
          remainingChildren,
        });
      }
    },
  });

  // Apply in reverse so list positions stay valid
  for (let i = transforms.length - 1; i >= 0; i--) {
    const {
      parentRule,
      parentItem,
      parentList,
      nestedAtrules,
      remainingChildren,
    } = transforms[i]!;

    // Build replacement list: [modified parent rule (if any), unnested @media rules...]
    const replacements = new List<CssNode>();

    if (remainingChildren.length > 0) {
      parentRule.block.children = new List<CssNode>().fromArray(
        remainingChildren,
      );
      replacements.appendData(parentRule);
    }

    for (const atrule of nestedAtrules) {
      const flattened = flattenMediaChain(atrule);

      const wrappedRule: Rule = {
        type: 'Rule',
        prelude: clone(parentRule.prelude) as Rule['prelude'],
        block: {
          type: 'Block',
          children: flattened.block
            ? flattened.block.children
            : new List<CssNode>(),
        },
      };

      const newAtrule: Atrule = {
        type: 'Atrule',
        name: flattened.name,
        prelude: flattened.prelude,
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

  return transforms.length > 0;
}

/**
 * Flatten a chain of @media rules nested directly inside each other — what
 * Tailwind emits for stacked variants like `sm:dark:bg-black` — into a single
 * @media whose conditions are combined with `and`:
 *
 * Before: `@media (width>=40rem){@media (prefers-color-scheme:dark){...}}`
 * After:  `@media (width>=40rem) and (prefers-color-scheme:dark){...}`
 *
 * Without this, hoisting the chain out of its style rule one level at a time
 * would leave a @media nested inside the newly created rule.
 *
 * Only single-query preludes are combined: combining comma-separated media
 * query lists would need a cross product, and Tailwind doesn't emit those
 * for stacked variants, so chains involving a list keep their nested form.
 */
function flattenMediaChain(atrule: Atrule): Atrule {
  if (atrule.name.toLowerCase() !== 'media') {
    return atrule;
  }

  let current = atrule;
  let combinedPrelude = atrule.prelude;

  while (current.block && current.block.children.size === 1) {
    const onlyChild = current.block.children.first;
    if (
      !onlyChild ||
      onlyChild.type !== 'Atrule' ||
      onlyChild.name.toLowerCase() !== 'media' ||
      !current.prelude ||
      !onlyChild.prelude
    ) {
      break;
    }

    const outerText = generate(combinedPrelude ?? current.prelude);
    const innerText = generate(onlyChild.prelude);
    if (outerText.includes(',') || innerText.includes(',')) {
      break;
    }

    // `parse` with the mediaQueryList context returns a MediaQueryList node,
    // but @types/css-tree 2.x doesn't include it in Atrule['prelude'] (same
    // stale-types gap as the module augmentation at the top of this file).
    combinedPrelude = parse(`${outerText} and ${innerText}`, {
      context: 'mediaQueryList',
    }) as Atrule['prelude'];
    current = onlyChild;
  }

  if (current === atrule) {
    return atrule;
  }

  return {
    type: 'Atrule',
    name: current.name,
    prelude: combinedPrelude,
    block: current.block,
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
