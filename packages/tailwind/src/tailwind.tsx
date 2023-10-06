import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import htmlParser, {
  attributesToProps,
  domToReact,
  Element,
} from "html-react-parser";
import { tailwindToCSS, type TailwindConfig } from "tw-to-css";
import { cleanCss, makeCssMap, getMediaQueryCss } from "./utils";

export interface TailwindProps {
  children: React.ReactNode;
  config?: TailwindConfig;
}

export const Tailwind: React.FC<TailwindProps> = ({ children, config }) => {
  const { twi } = tailwindToCSS({
    config,
  });

  const newChildren = React.Children.toArray(children);

  const fullHTML = renderToStaticMarkup(<>{newChildren}</>);

  const tailwindCss = twi(fullHTML, {
    merge: false,
    ignoreMediaQueries: false,
  });
  const css = cleanCss(tailwindCss);
  const cssMap = makeCssMap(css);

  const headStyle = getMediaQueryCss(css);

  const hasResponsiveStyles = /@media[^{]+\{(?<content>[\s\S]+?)\}\s*\}/gm.test(
    headStyle,
  );
  const hasHTML = /<html[^>]*>/gm.test(fullHTML);
  const hasHead = /<head[^>]*>/gm.test(fullHTML);

  if (hasResponsiveStyles && (!hasHTML || !hasHead)) {
    throw new Error(
      "Tailwind: To use responsive styles you must have a <html> and <head> element in your template.",
    );
  }

  const reactHTML = React.Children.map(newChildren, (child) => {
    if (!React.isValidElement(child)) return child;

    const html = renderToStaticMarkup(child);

    const parsedHTML = htmlParser(html, {
      replace: (domNode) => {
        if (domNode instanceof Element) {
          if (hasResponsiveStyles && hasHead && domNode.name === "head") {
            const props = attributesToProps(domNode.attribs);

            const newDomNode = (
              <head {...props}>
                {domToReact(domNode.children)}
                <style>{headStyle}</style>
              </head>
            );

            return newDomNode;
          }

          if (domNode.attribs.class) {
            const cleanRegex = /[:#!\-[\]/.%]+/g;
            const cleanTailwindClasses = domNode.attribs.class
              // replace all non-alphanumeric characters with underscores
              .replace(cleanRegex, "_");

            const currentStyles = domNode.attribs.style
              ? `${domNode.attribs.style};`
              : "";
            const tailwindStyles = cleanTailwindClasses
              .split(" ")
              .map((className) => {
                return cssMap[`.${className}`];
              })
              .join(";");
            domNode.attribs.style = `${currentStyles} ${tailwindStyles}`;

            domNode.attribs.class = domNode.attribs.class
              // remove all non-responsive classes (ex: m-2 md:m-4 > md:m-4)
              .split(" ")
              .filter((className) => className.search(/^.{2}:/) !== -1)
              .join(" ")
              // replace all non-alphanumeric characters with underscores
              .replace(cleanRegex, "_");

            if (domNode.attribs.class === "") delete domNode.attribs.class;
          }
        }
      },
    });

    return parsedHTML;
  });

  return <>{reactHTML}</>;
};

Tailwind.displayName = "Tailwind";
