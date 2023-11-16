/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import type { TailwindConfig, twi as TwiType } from "tw-to-css";
import { tailwindToCSS } from "tw-to-css";
import { cssToJsxStyle } from "./utils/css-to-jsx-style";

export interface TailwindProps {
  children: React.ReactNode;
  config?: TailwindConfig;
}

function processElement(
  element: React.ReactElement,
  headStyles: string[],
  twi: typeof TwiType,
): React.ReactElement {
  let modifiedElement = element;
  const propsClassName = modifiedElement.props.className as string | undefined;

  // if it is not a string it is undefined
  if (typeof propsClassName === "string") {
    const convertedStyles: string[] = [];
    const responsiveClassNames: string[] = [];
    const customClassNames: string[] = [];

    const allClassNames = propsClassName.split(" ");

    allClassNames.forEach((className) => {
      const stylesWithoutMediaQueries = twi(className, {
        ignoreMediaQueries: true,
      });

      if (stylesWithoutMediaQueries.length > 0) {
        convertedStyles.push(stylesWithoutMediaQueries);
      } else if (twi(className, { ignoreMediaQueries: false }).length > 0) {
        const classPieces = className.split(":");
        const mediaQueryParts = classPieces.slice(0, -1);
        const twClass = classPieces[classPieces.length - 1];

        const importantPrefixedClassName = twClass.startsWith("!")
          ? className
          : `${mediaQueryParts.join(":")}:!${twClass}`;
        responsiveClassNames.push(importantPrefixedClassName);
      } else {
        customClassNames.push(className);
      }
    });

    const convertedResponsiveStyles = twi(responsiveClassNames, {
      ignoreMediaQueries: false,
      merge: false,
    });

    headStyles.push(
      convertedResponsiveStyles.replace(/^\n+/, "").replace(/\n+$/, ""),
    );

    modifiedElement = React.cloneElement(modifiedElement, {
      ...modifiedElement.props,
      className:
        customClassNames.length > 0 || responsiveClassNames.length > 0
          ? customClassNames
              // responsive class names should be kept so the media queries can actually work
              // this is not exactly supported on all email clients, but it is the only way
              // to have media queries
              .concat(responsiveClassNames)
              .join(" ")
          : undefined,
      style: {
        ...(modifiedElement.props.style as Record<string, string>),
        ...cssToJsxStyle(convertedStyles.join(" ")),
      },
    });
  }

  if (modifiedElement.props.children) {
    const children = React.Children.toArray(modifiedElement.props.children);
    const processedChildren = children.map((child) => {
      if (React.isValidElement(child)) {
        return processElement(child, headStyles, twi);
      }
      return child;
    });

    modifiedElement = React.cloneElement(
      modifiedElement,
      modifiedElement.props,
      ...processedChildren,
    );
  }

  return modifiedElement;
}

function processHead(
  child: React.ReactElement,
  responsiveStyles: string[],
): React.ReactElement {
  let modifiedChild = child;

  // FIXME: find a cleaner solution for child as any
  if (
    modifiedChild.type === "head" ||
    (modifiedChild as unknown as { type: { displayName: string } }).type
      .displayName === "Head"
  ) {
    const styleElement = <style>{responsiveStyles}</style>;

    const headChildren = React.Children.toArray(modifiedChild.props.children);
    headChildren.push(styleElement);

    modifiedChild = React.cloneElement(
      modifiedChild,
      modifiedChild.props,
      ...headChildren,
    );
  }
  if (modifiedChild.props.children) {
    const children = React.Children.toArray(modifiedChild.props.children);
    const processedChildren = children.map((processedChild) => {
      if (React.isValidElement(processedChild)) {
        return processHead(processedChild, responsiveStyles);
      }
      return processedChild;
    });

    modifiedChild = React.cloneElement(
      modifiedChild,
      modifiedChild.props,
      ...processedChildren,
    );
  }

  return modifiedChild;
}

export const Tailwind: React.FC<TailwindProps> = ({ children, config }) => {
  const headStyles: string[] = [];

  const { twi } = tailwindToCSS({
    config,
  });

  const childrenWithInlineStyles = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return processElement(child, headStyles, twi);
    }
    return child;
  });

  if (!childrenWithInlineStyles) return <>{children}</>;

  const fullHTML = renderToStaticMarkup(<>{childrenWithInlineStyles}</>);

  const hasResponsiveStyles = /@media[^{]+\{(?<content>[\s\S]+?)\}\s*\}/gm.test(
    headStyles.join(" "),
  );

  const hasHTMLAndHead = /<html[^>]*>(?=[\s\S]*<head[^>]*>)/gm.test(fullHTML);

  if (hasResponsiveStyles && !hasHTMLAndHead) {
    throw new Error(
      "Tailwind: To use responsive styles you must have a <html> and <head> element in your template.",
    );
  }

  const childrenWithInlineAndResponsiveStyles = React.Children.map(
    childrenWithInlineStyles,
    (child) => {
      if (React.isValidElement(child)) {
        return processHead(child, headStyles);
      }
      return child;
    },
  );

  return <>{childrenWithInlineAndResponsiveStyles}</>;
};
