import * as React from "react";
import type { HeadProps } from "@react-email/head";
import type { JitContext } from "tailwindcss/lib/lib/setupContextUtils";
import { type AtRule, parse, atRule as createAtRule } from "postcss";
import type { TailwindConfig } from "./config";
import { minifyCss } from "./utils/css";
import { setupTailwindContext } from "./utils";
import { reactStylesForElement } from "./utils/style-inlining";

export interface TailwindProps {
  children: React.ReactNode;
  config?: TailwindConfig;
}

function substituteTailwindClassNamesForInlineStyles(
  element: AnyElement,
  tailwindContext: JitContext,
): { elementWithInlinedStyles: AnyElement; mediaQueries: string[] } {
  if (
    "className" in element.props &&
    typeof element.props.className === "string"
  ) {
    const { inlineStyles, tailwindClassNames, mediaQueryRules } =
      reactStylesForElement(
        element as React.ReactElement<{ className: string }>,
        tailwindContext,
      );

    const mediaQueries = mediaQueryRules.map((atRule) => atRule.toString());

    const nonInlinedClassNames = element.props.className
      .split(" ")
      .filter((className) => !tailwindClassNames.includes(className))
      .join(" ");

    return {
      elementWithInlinedStyles: React.cloneElement(
        element,
        {
          ...element.props,
          className:
            nonInlinedClassNames.length === 0
              ? undefined
              : nonInlinedClassNames,
          // passing in style here as undefined may mess up
          // the rendering process of child components
          ...(typeof element.props.style === "undefined"
            ? { style: { ...inlineStyles } }
            : { style: { ...element.props.style, ...inlineStyles } }),
        },
        element.props.children
      ),
      mediaQueries,
    };
  }

  return {
    elementWithInlinedStyles: element,
    mediaQueries: [],
  };
}

type AnyElement = React.ReactElement<React.HTMLAttributes<HTMLElement>>;

type HeadElement = React.ReactElement<
  HeadProps,
  string | React.JSXElementConstructor<HeadProps>
>;

function processHead(
  headElement: HeadElement,
  responsiveStyles: string[],
): React.ReactElement {
  const styles = responsiveStyles.join("");
  const mediaQueriesRoot = parse(styles);

  const atRules = {} as Record<string, AtRule>;

  mediaQueriesRoot.walkAtRules("media", (atRule) => {
    const key = atRule.params;

    if (!(key in atRules)) {
      atRules[key] = createAtRule({
        name: atRule.name,
        params: atRule.params,
      });
    }
    atRule.nodes.forEach((node) => {
      atRules[key].append(node.clone());
    });

    atRule.remove();
  });

  Object.keys(atRules).forEach((key) => {
    mediaQueriesRoot.append(atRules[key]);
  });

  /*                   only minify here since it is the only place that is going to be in the DOM */
  const styleElement = <style>{minifyCss(mediaQueriesRoot.toString())}</style>;

  return React.cloneElement(
    headElement,
    headElement.props,
    headElement.props.children,
    styleElement,
  );
}

export const Tailwind: React.FC<TailwindProps> = ({ children, config }) => {
  const headStyles = new Set<string>();

  const tailwindContext = setupTailwindContext(config ?? {});

  const childrenArray = React.Children.toArray(children);
  const validElementsWithIndexes = childrenArray
    .map((child, i) => [child, i] as [AnyElement, number])
    .filter(([child]) => React.isValidElement(child));

  let headElementIndex = -1;

  const processElement = (element: AnyElement) => {
    let modifiedElement = element;
    let elementChildren = React.Children.toArray(
      modifiedElement.props.children,
    );

    const { elementWithInlinedStyles, mediaQueries } =
      substituteTailwindClassNamesForInlineStyles(element, tailwindContext);
    modifiedElement = elementWithInlinedStyles;
    for (const mediaQuery of mediaQueries) {
      headStyles.add(mediaQuery);
    }

    if (elementWithInlinedStyles.props.children) {
      elementChildren = elementChildren.map(
        (child) => {
          if (React.isValidElement(child)) {
            return processElement(child as AnyElement);
          }
          return child;
        },
      );
    }

    modifiedElement = React.cloneElement(
      modifiedElement,
      {
        key: Math.random().toString(),
        ...modifiedElement.props,
      },
      ...elementChildren,
    );

    // if this is a component, then we render it and recurse it through processElement
    if (typeof modifiedElement.type === "function") {
      const component = modifiedElement.type as React.FC;
      const renderedComponent = component(modifiedElement.props);
      if (React.isValidElement(renderedComponent)) {
        modifiedElement = processElement(renderedComponent as AnyElement);
      }
    }

    return modifiedElement;
  };

  validElementsWithIndexes.forEach(([element, i]) => {
    childrenArray[i] = processElement(element);

    if (
      element.type === "head" ||
      (typeof element.type === "function" &&
        "name" in element.type &&
        element.type.name === "Head")
    ) {
      headElementIndex = i;
    }
  });

  if (headStyles.size > 0) {
    if (headElementIndex === -1) {
      throw new Error(
        "Tailwind: To use responsive styles you must have a <head> element as a direct child of the Tailwind component.",
      );
    }

    const [headElement, headAllElementsIndex] = validElementsWithIndexes[
      headElementIndex
    ] as [HeadElement, number];

    childrenArray[headAllElementsIndex] = processHead(headElement, [
      ...headStyles.values(),
    ]);
  }

  return <>{childrenArray}</>;
};
