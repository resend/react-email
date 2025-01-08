import * as React from 'react';
import type { Config as TailwindOriginalConfig } from 'patched-tailwindcss';
import Root from 'patched-postcss/lib/root';
import { minifyCss } from './utils/css/minify-css';
import { setupTailwind } from './utils/tailwindcss/setup-tailwind';
import { mapReactTree } from './utils/react/map-react-tree';
import { cloneElementWithInlinedStyles } from './utils/tailwindcss/clone-element-with-inlined-styles';
import { removeRuleDuplicatesFromRoot } from './utils/css/remove-rule-duplicates-from-root';

export type TailwindConfig = Pick<
  TailwindOriginalConfig,
  | 'important'
  | 'prefix'
  | 'separator'
  | 'safelist'
  | 'blocklist'
  | 'presets'
  | 'future'
  | 'experimental'
  | 'darkMode'
  | 'theme'
  | 'corePlugins'
  | 'plugins'
>;

export interface TailwindProps {
  children: React.ReactNode;
  config?: TailwindConfig;
}

export interface EmailElementProps {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const Tailwind: React.FC<TailwindProps> = ({ children, config }) => {
  const tailwind = setupTailwind(config ?? {});

  const nonInlineStylesRootToApply = new Root();
  let mediaQueryClassesForAllElement: string[] = [];

  let hasNonInlineStylesToApply = false as boolean;

  let mappedChildren: React.ReactNode = mapReactTree(children, (node) => {
    if (React.isValidElement<EmailElementProps>(node)) {
      const {
        elementWithInlinedStyles,
        nonInlinableClasses,
        nonInlineStyleNodes,
      } = cloneElementWithInlinedStyles(node, tailwind);
      mediaQueryClassesForAllElement =
        mediaQueryClassesForAllElement.concat(nonInlinableClasses);
      nonInlineStylesRootToApply.append(nonInlineStyleNodes);

      if (nonInlinableClasses.length > 0 && !hasNonInlineStylesToApply) {
        hasNonInlineStylesToApply = true;
      }

      return elementWithInlinedStyles;
    }

    return node;
  });

  removeRuleDuplicatesFromRoot(nonInlineStylesRootToApply);

  if (hasNonInlineStylesToApply) {
    let hasAppliedNonInlineStyles = false as boolean;

    mappedChildren = mapReactTree(mappedChildren, (node) => {
      if (hasAppliedNonInlineStyles) {
        return node;
      }

      if (React.isValidElement<EmailElementProps>(node)) {
        if (node.type === 'head') {
          hasAppliedNonInlineStyles = true;

          /*                   only minify here since it is the only place that is going to be in the DOM */
          const styleElement = (
            <style>
              {minifyCss(nonInlineStylesRootToApply.toString().trim())}
            </style>
          );

          return React.cloneElement(
            node,
            node.props,
            node.props.children,
            styleElement,
          );
        }
      }

      return node;
    });

    if (!hasAppliedNonInlineStyles) {
      throw new Error(
        `You are trying to use the following Tailwind classes that cannot be inlined: ${mediaQueryClassesForAllElement.join(
          ' ',
        )}.
For the media queries to work properly on rendering, they need to be added into a <style> tag inside of a <head> tag,
the Tailwind component tried finding a <head> element but just wasn't able to find it.

Make sure that you have a <head> element at some point inside of the <Tailwind> component at any depth. 
This can also be our <Head> component.

If you do already have a <head> element at some depth, 
please file a bug https://github.com/resend/react-email/issues/new?assignees=&labels=Type%3A+Bug&projects=&template=1.bug_report.yml.`,
      );
    }
  }

  return mappedChildren;
};
