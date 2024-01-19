/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import * as React from "react";
import type { Config as TailwindOriginalConfig } from "tailwindcss";
import type { HeadProps } from "@react-email/head";
import { cssToJsxStyle } from "./utils/css-to-jsx-style";
import { getCssForMarkup } from "./utils/get-css-for-markup";
import { minifyCss } from "./utils/minify-css";
import { getStylesPerClassMap } from "./utils/get-css-class-properties-map";
import { escapeClassName } from "./utils/escape-class-name";
import { useRgbNonSpacedSyntax } from "./utils/use-rgb-non-spaced-syntax";
import { quickSafeRenderToString } from "./utils/quick-safe-render-to-string";

export type TailwindConfig = Omit<TailwindOriginalConfig, "content">;

export interface TailwindProps {
  children: React.ReactNode;
  config?: TailwindConfig;
}

function processElement(
  element: React.ReactElement,
  nonMediaQueryTailwindStylesPerClass: Record<string, string>,
): React.ReactElement {
  let modifiedElement = element;

  let resultingClassName = modifiedElement.props.className as
    | string
    | undefined;
  let resultingStyle = modifiedElement.props.style as
    | React.CSSProperties
    | undefined;
  let resultingChildren: React.ReactNode[] = [];

  if (modifiedElement.props.className) {
    const fullClassName = modifiedElement.props.className as string;
    const classNames = fullClassName.split(" ");
    const classNamesToKeep = [] as string[];

    const styles = [] as string[];

    classNames.forEach((className) => {
      /*                        escape all unallowed characters in css class selectors */
      const escapedClassName = escapeClassName(className);
      // no need to filter in for media query classes since it is going to keep these classes
      // as custom since they are not going to be in the markup map of styles
      if (
        typeof nonMediaQueryTailwindStylesPerClass[escapedClassName] ===
        "undefined"
      ) {
        classNamesToKeep.push(className);
      } else {
        styles.push(
          `${nonMediaQueryTailwindStylesPerClass[escapedClassName]};`,
        );
      }
    });

    resultingStyle = {
      ...(modifiedElement.props.style as Record<string, string>),
      ...cssToJsxStyle(styles.join(" ")),
    };
    resultingClassName =
      classNamesToKeep.length > 0 ? classNamesToKeep.join(" ") : undefined;
  }

  if (modifiedElement.props.children) {
    resultingChildren = React.Children.toArray(
      modifiedElement.props.children,
    ).map((child) => {
      if (React.isValidElement(child)) {
        return processElement(child, nonMediaQueryTailwindStylesPerClass);
      }
      return child;
    });
  }

  modifiedElement = React.cloneElement(
    modifiedElement,
    {
      ...modifiedElement.props,
      className: resultingClassName,
      // passing in style here as undefined may mess up
      // the rendering process of child components
      ...(typeof resultingStyle === "undefined"
        ? {}
        : { style: resultingStyle }),
    },
    ...resultingChildren,
  );

  // if this is a component, then we render it and recurse it through processElement
  if (typeof modifiedElement.type === "function") {
    const component = modifiedElement.type as React.FC;
    const renderedComponent = component(modifiedElement.props);
    if (React.isValidElement(renderedComponent)) {
      modifiedElement = processElement(
        renderedComponent,
        nonMediaQueryTailwindStylesPerClass,
      );
    }
  }

  return modifiedElement;
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
  /*                   only minify here since it is the only place that is going to be in the DOM */
  const styleElement = <style>{minifyCss(responsiveStyles.join(""))}</style>;

  return React.cloneElement(
    headElement,
    headElement.props,
    ...React.Children.toArray(headElement.props.children),
    styleElement,
  );
}

export const Tailwind: React.FC<TailwindProps> = ({ children, config }) => {
  let headStyles: string[] = [];

  const markupWithTailwindClasses = quickSafeRenderToString(<>{children}</>);
  const markupCSS = useRgbNonSpacedSyntax(
    getCssForMarkup(markupWithTailwindClasses, config),
  );

  const nonMediaQueryCSS = markupCSS.replaceAll(
    /@media\s*\(.*\)\s*{\s*\.(.*)\s*{[\s\S]*}\s*}/gm,
    (mediaQuery, _className) => {
      headStyles.push(
        mediaQuery
          .replace(/[\r\n|\r|\n]+/g, "")
          .replace(/\s+/g, " ")
          .replaceAll(/\s*\.[\S]+\s*{([^}]*)}/gm, (match, content: string) => {
            return match.replace(
              content,
              content
                .split(";")
                .map((propertyDeclaration) =>
                  propertyDeclaration.endsWith("!important")
                    ? propertyDeclaration.trim()
                    : `${propertyDeclaration.trim()}!important`,
                )
                .join(";"),
            );
          }),
      );

      return "";
    },
  );

  const nonMediaQueryTailwindStylesPerClass =
    getStylesPerClassMap(nonMediaQueryCSS);

  const childrenArray = React.Children.toArray(children);
  const validElementsWithIndexes = childrenArray
    .map((child, i) => [child, i] as [AnyElement, number])
    .filter(([child]) => React.isValidElement(child));

  let headElementIndex = -1;

  validElementsWithIndexes.forEach(([element, i]) => {
    childrenArray[i] = processElement(
      element,
      nonMediaQueryTailwindStylesPerClass,
    );

    if (
      element.type === "head" ||
      (typeof element.type === "function" &&
        "name" in element.type &&
        element.type.name === "Head")
    ) {
      headElementIndex = i;
    }
  });

  headStyles = headStyles.filter((style) => style.trim().length > 0);

  if (headStyles.length > 0) {
    if (headElementIndex === -1) {
      throw new Error(
        "Tailwind: To use responsive styles you must have a <head> element as a direct child of the Tailwind component.",
      );
    }

    const [headElement, headAllElementsIndex] = validElementsWithIndexes[
      headElementIndex
    ] as [HeadElement, number];

    childrenArray[headAllElementsIndex] = processHead(headElement, headStyles);
  }

  return <>{childrenArray}</>;
};
