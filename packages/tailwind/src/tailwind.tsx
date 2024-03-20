import * as React from "react";
import type { Config as TailwindOriginalConfig } from "tailwindcss";
import { Root } from "postcss";
import { minifyCss } from "./utils/css/minify-css";
import { useTailwind } from "./hooks/use-tailwind";
import { walkElements } from "./utils/react/walk-elements";
import { useCloneElementWithInlinedStyles } from "./hooks/use-clone-element-with-inlined-styles";

export type TailwindConfig = Omit<TailwindOriginalConfig, "content">;

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
  const tailwind = useTailwind(config ?? {});

  const cloneElementWithInlinedStyles = useCloneElementWithInlinedStyles(tailwind);

  const nonInlineStylesRootToApply = new Root();
  let mediaQueryClassesForAllElement: string[] = [];
  let hasNonInlineStylesToApply = false as boolean;

  let mappedChildren = walkElements(children, {
    process(node) {
      if (React.isValidElement<EmailElementProps>(node)) {
        const element = node;

        const { elementWithInlinedStyles, nonInlinableClasses, nonInlineStyleNodes } = cloneElementWithInlinedStyles(element);
        mediaQueryClassesForAllElement = mediaQueryClassesForAllElement.concat(nonInlinableClasses);
        nonInlineStylesRootToApply.append(nonInlineStyleNodes);

        if (nonInlinableClasses.length > 0 && !hasNonInlineStylesToApply) {
          hasNonInlineStylesToApply = true;
        }

        return elementWithInlinedStyles;
      }

      return node;
    },
  });

  let hasAppliedNonInlineStyles = false as boolean;

  if (hasNonInlineStylesToApply) {
    mappedChildren = walkElements(mappedChildren, {
      process(node) {
        if (hasAppliedNonInlineStyles) {
          return node;
        }

        if (React.isValidElement<EmailElementProps>(node)) {
          const element = node;
          if (element.type === "head") {
            hasAppliedNonInlineStyles = true;

            /*                   only minify here since it is the only place that is going to be in the DOM */
            const styleElement = (
              <style>
                {minifyCss(nonInlineStylesRootToApply.toString().trim())}
              </style>
            );

            return React.cloneElement(
              element,
              { ...element.props, key: element.key },
              element.props.children,
              styleElement,
            );
          }

          return element;
        }

        return node;
      },
      afterAll() {
        if (!hasAppliedNonInlineStyles && hasNonInlineStylesToApply) {
          throw new Error(
            `You are trying to use the following Tailwind classes that have media queries: ${mediaQueryClassesForAllElement.join(
              " ",
            )}.
For the media queries to work properly on rendering, they need to be added into a <style> tag inside of a <head> tag,
the Tailwind component tried finding a <head> element but just wasn't able to find it.

Make sure that you have either a <head> element at some point inside of the <Tailwind> component at any depth.

If you do already have a <head> element at some depth, please file a bug https://github.com/resend/react-email/issues/new?assignees=&labels=Type%3A+Bug&projects=&template=1.bug_report.yml.`,
          );
        }
      },
    });
  }

  return <>{mappedChildren}</>;
};
