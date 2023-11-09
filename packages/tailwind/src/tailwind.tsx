/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import * as React from "react";

import { Config as TailwindOriginalConfig } from "tailwindcss";
import type { HeadProps } from "@react-email/head";

import { cssToJsxStyle } from "./utils/css-to-jsx-style";
import { getCSSForMarkup } from "./utils/get-css-for-markup";
import { renderToStaticMarkup } from "react-dom/server";
import { minifyCSS } from "./utils/minify-css";

export type TailwindConfig = Omit<TailwindOriginalConfig, 'content'>;

export interface TailwindProps {
  children: React.ReactNode;
  config?: TailwindConfig;
}

function processElement(
  element: React.ReactElement,
  nonMediaQueryTailwindStylesPerClass: Record<string, string>
): React.ReactElement {
  let modifiedElement = element;

  let resultingClassName: string | undefined = undefined;
  let resultingStyle: React.CSSProperties | undefined = undefined;
  let resultingChildren: React.ReactNode[] = [];

  if (modifiedElement.props.className) {
    const fullClassName = modifiedElement.props.className as string;
    const classNames = fullClassName.split(" ");
    const classNamesToKeep = [] as string[];

    const styles = [] as string[];

    classNames.forEach(className => {
      /*                        escape all unallowed characters in css class selectors */
      const escapedClassName = className.replace(/(?<!\\)[^a-zA-Z0-9\-_]/g, (m) => '\\' + m);
      // no need to filter in for media query classes since it is going to keep these classes
      // as custom since they are not going to be in the markup map of styles
      if (typeof nonMediaQueryTailwindStylesPerClass[escapedClassName] === 'undefined') {
        classNamesToKeep.push(className);
      } else {
        styles.push(`${nonMediaQueryTailwindStylesPerClass[escapedClassName]};`);
      }
    });

    resultingStyle = {
      ...(modifiedElement.props.style as Record<string, string>),
      ...cssToJsxStyle(styles.join(' ')),
    };
    resultingClassName = classNamesToKeep.length > 0 ? classNamesToKeep.join(' ') : undefined;
  }

  if (modifiedElement.props.children) {
    const children = React.Children.toArray(modifiedElement.props.children);
    resultingChildren = children.map((child) => {
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
      style: resultingStyle
    },
    ...resultingChildren,
  );

  return modifiedElement;
}

type AnyElement = React.ReactElement<
  React.HTMLAttributes<HTMLElement>,
  string | React.JSXElementConstructor<any>
>;

type HeadElement = React.ReactElement<
  HeadProps,
  string | React.JSXElementConstructor<HeadProps>
>;

function processHead(
  headElement: HeadElement,
  responsiveStyles: string[],
): React.ReactElement {
  /*                   only minify here since it is the only place that is going to be in the DOM */
  const styleElement = <style>{minifyCSS(responsiveStyles.join(''))}</style>;

  return React.cloneElement(
    headElement,
    headElement.props,
    ...React.Children.toArray(headElement.props.children),
    styleElement,
  );
}

export const Tailwind: React.FC<TailwindProps> = ({ children, config }) => {
  let headStyles: string[] = [];

  const markupWithTailwindClasses = renderToStaticMarkup(<>{children}</>);
  const markupCSS = getCSSForMarkup(markupWithTailwindClasses, config);

  const nonMediaQueryCSS = markupCSS.replaceAll(
    /@media\s*\(.*\)\s*{\s*\.(.*)\s*{[\s\S]*}\s*}/gm, 
    (mediaQuery, _className) => {
      headStyles.push(mediaQuery.replace(/[\r\n|\r|\n]+/g, "").replace(/\s+/g, " "));
      return "";
    }
  );

  const nonMediaQueryTailwindStylesPerClass = {} as Record<string, string>;
  for (const [_match, className, contents] of nonMediaQueryCSS.matchAll(
    /\s*\.([\S]+)\s*{([^}]*)}/gm
  )) {
    nonMediaQueryTailwindStylesPerClass[className.trim()] = contents
      .replace(/^\n+/, "")
      .replace(/\n+$/, "")
      .trim();
  }

  const childrenArray = React.Children.toArray(children);
  const validElementsWithIndexes = childrenArray
    .map((child, i) => [child, i] as [AnyElement, number])
    .filter(([child]) => React.isValidElement(child));

  let headElementIndex = -1;

  validElementsWithIndexes.forEach(([element, i]) => {
    childrenArray[i] = processElement(element, nonMediaQueryTailwindStylesPerClass);

    if (element.type === "head" ||
      (typeof element.type === "function" &&
        "name" in element.type &&
        element.type.name === "Head")) {
      headElementIndex = i;
    }
  });

  headStyles = headStyles.filter(style => style.trim().length > 0);

  if (headStyles.length > 0) {
    if (headElementIndex === -1) {
      throw new Error(
        "Tailwind: To use responsive styles you must have a <head> element as a direct child of the Tailwind component.",
      );
    }

    const [headElement, headAllElementsIndex] = validElementsWithIndexes[headElementIndex] as [
      HeadElement, number
    ];

    childrenArray[headAllElementsIndex] = processHead(headElement, headStyles);
  }

  return <>{childrenArray}</>;
};
