import { Root } from 'postcss';
import * as React from 'react';
import type { Config } from 'tailwindcss';
import { minifyCss } from './utils/css/minify-css';
import { removeRuleDuplicatesFromRoot } from './utils/css/remove-rule-duplicates-from-root';
import { mapReactTree } from './utils/react/map-react-tree';
import { cloneElementWithInlinedStyles } from './utils/tailwindcss/clone-element-with-inlined-styles';

export type TailwindConfig = Omit<Config, 'content'>;

export interface TailwindProps {
  children: React.ReactNode;
  config?: TailwindConfig;
}

export interface EmailElementProps {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const pixelBasedPreset: TailwindConfig = {
  theme: {
    fontSize: {
      xs: ['12px', { lineHeight: '16px' }],
      sm: ['14px', { lineHeight: '20px' }],
      base: ['16px', { lineHeight: '24px' }],
      lg: ['18px', { lineHeight: '28px' }],
      xl: ['20px', { lineHeight: '28px' }],
      '2xl': ['24px', { lineHeight: '32px' }],
      '3xl': ['30px', { lineHeight: '36px' }],
      '4xl': ['36px', { lineHeight: '36px' }],
      '5xl': ['48px', { lineHeight: '1' }],
      '6xl': ['60px', { lineHeight: '1' }],
      '7xl': ['72px', { lineHeight: '1' }],
      '8xl': ['96px', { lineHeight: '1' }],
      '9xl': ['144px', { lineHeight: '1' }],
    },
    spacing: {
      px: '1px',
      0: '0',
      0.5: '2px',
      1: '4px',
      1.5: '6px',
      2: '8px',
      2.5: '10px',
      3: '12px',
      3.5: '14px',
      4: '16px',
      5: '20px',
      6: '24px',
      7: '28px',
      8: '32px',
      9: '36px',
      10: '40px',
      11: '44px',
      12: '48px',
      14: '56px',
      16: '64px',
      20: '80px',
      24: '96px',
      28: '112px',
      32: '128px',
      36: '144px',
      40: '160px',
      44: '176px',
      48: '192px',
      52: '208px',
      56: '224px',
      60: '240px',
      64: '256px',
      72: '288px',
      80: '320px',
      96: '384px',
    },
  },
};

export const Tailwind: React.FC<TailwindProps> = async ({
  children,
  config,
}) => {
  const nonInlineStylesRootToApply = new Root();
  let mediaQueryClassesForAllElement: string[] = [];

  let hasNonInlineStylesToApply = false as boolean;

  let mappedChildren: React.ReactNode = await mapReactTree(
    children,
    async (node) => {
      if (React.isValidElement<EmailElementProps>(node)) {
        const {
          elementWithInlinedStyles,
          nonInlinableClasses,
          nonInlineStyleNodes,
        } = await cloneElementWithInlinedStyles(node, config ?? {});
        mediaQueryClassesForAllElement =
          mediaQueryClassesForAllElement.concat(nonInlinableClasses);
        nonInlineStylesRootToApply.append(nonInlineStyleNodes);

        if (nonInlinableClasses.length > 0 && !hasNonInlineStylesToApply) {
          hasNonInlineStylesToApply = true;
        }

        return elementWithInlinedStyles;
      }

      return node;
    },
  );

  removeRuleDuplicatesFromRoot(nonInlineStylesRootToApply);

  if (hasNonInlineStylesToApply) {
    let hasAppliedNonInlineStyles = false as boolean;

    mappedChildren = await mapReactTree(mappedChildren, (node) => {
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
