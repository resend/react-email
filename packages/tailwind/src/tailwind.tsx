import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { tailwindToCSS, TailwindConfig } from "tw-to-css";

import { cssToJsxStyle } from "./utils";

export interface TailwindProps {
  children: React.ReactNode;
  config?: TailwindConfig;
}

function processElement(
  element: React.ReactElement,
  headStyles: string[],
  config?: TailwindConfig,
): React.ReactElement {
  const { twi } = tailwindToCSS({
    config,
  });

  if (element.props.className) {
    const convertedStyles: string[] = [];
    const responsiveStyles: string[] = [];
    const classNames = element.props.className.split(" ");

    const customClassNames = classNames.filter((className: string) => {
      if (twi(className, { ignoreMediaQueries: true })) {
        convertedStyles.push(twi(className, { ignoreMediaQueries: true }));
        return false;
      } else if (twi(className, { ignoreMediaQueries: false })) {
        responsiveStyles.push(className);
        return false;
      }
      return true;
    });

    const convertedResponsiveStyles = twi(responsiveStyles, {
      ignoreMediaQueries: false,
      merge: false,
    });

    headStyles.push(
      convertedResponsiveStyles.replace(/^\n+/, "").replace(/\n+$/, ""),
    );

    const newProps = {
      ...element.props,
      className: customClassNames.length
        ? customClassNames.join(" ")
        : undefined,
      style: {
        ...element.props.style,
        ...cssToJsxStyle(convertedStyles.join(" ")),
      },
    };

    element = React.cloneElement(element, newProps);
  }

  if (element.props.children) {
    const children = React.Children.toArray(element.props.children);
    const processedChildren = children.map((child) => {
      if (React.isValidElement(child)) {
        return processElement(child, headStyles, config);
      }
      return child;
    });

    element = React.cloneElement(element, element.props, ...processedChildren);
  }

  return element;
}

function processHead(
  child: React.ReactElement,
  responsiveStyles: string[],
): React.ReactElement {
  // FIXME: find a cleaner solution for child as any
  if (child.type === "head" || (child as any).type.displayName === "Head") {
    const styleElement = <style>{responsiveStyles}</style>;

    const headChildren = React.Children.toArray(child.props.children);
    headChildren.push(styleElement);

    child = React.cloneElement(child, child.props, ...headChildren);
  }
  if (child.props.children) {
    const children = React.Children.toArray(child.props.children);
    const processedChildren = children.map((processedChild) => {
      if (React.isValidElement(processedChild)) {
        return processHead(processedChild, responsiveStyles);
      }
      return child;
    });

    child = React.cloneElement(child, child.props, ...processedChildren);
  }

  return child;
}

export const Tailwind: React.FC<TailwindProps> = ({ children, config }) => {
  const headStyles: string[] = [];

  const childrenWithInlineStyles = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return processElement(child, headStyles, config);
    }
    return child;
  });

  if (!childrenWithInlineStyles) return <>{children}</>;

  const fullHTML = renderToStaticMarkup(<>{childrenWithInlineStyles}</>);

  const hasResponsiveStyles = /@media[^{]+\{(?<content>[\s\S]+?)\}\s*\}/gm.test(
    headStyles.join(" "),
  );
  const hasHTML = /<html[^>]*>/gm.test(fullHTML);
  const hasHead = /<head[^>]*>/gm.test(fullHTML);

  if (hasResponsiveStyles && (!hasHTML || !hasHead)) {
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

Tailwind.displayName = "Tailwind";
