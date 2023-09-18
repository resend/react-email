import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import htmlParser, {
  attributesToProps,
  domToReact,
  Element,
} from "html-react-parser";
import { tailwindToCSS, TailwindConfig } from "tw-to-css";

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
            let newDomNode: JSX.Element | null = null;

            if (domNode.children) {
              const props = attributesToProps(domNode.attribs);

              newDomNode = (
                <head {...props}>
                  {domToReact(domNode.children)}
                  <style>{headStyle}</style>
                </head>
              );
            }

            return newDomNode;
          }

          if (domNode.attribs?.class) {
            const cleanRegex = /[:#\!\-[\]\/\.%]+/g;
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
              .filter((className) => {
                const cleanedClassName = className.replace(cleanRegex, "_");
                return (
                  className.search(/^.{2}:/) !== -1 ||
                  !cssMap[`.${cleanedClassName}`]
                );
              })
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

/**
 * Clean css selectors to replace all non-alphanumeric characters with underscores
 */
function cleanCss(css: string) {
  let newCss = css
    .replace(/\\/g, "")
    // find all css selectors and look ahead for opening and closing curly braces
    .replace(/[.\!\#\w\d\\:\-\[\]\/\.%\(\))]+(?=\s*?{[^{]*?\})\s*?{/g, (m) => {
      return m.replace(/(?<=.)[:#\!\-[\\\]\/\.%]+/g, "_");
    })
    .replace(/font-family(?<value>[^;\r\n]+)/g, (m, value) => {
      return `font-family${value.replace(/['"]+/g, "")}`;
    });
  return newCss;
}

/**
 * Get media query css to put in head
 */
function getMediaQueryCss(css: string) {
  const mediaQueryRegex = /@media[^{]+\{(?<content>[\s\S]+?)\}\s*\}/gm;

  return (
    css
      .replace(mediaQueryRegex, (m) => {
        return m.replace(
          /([^{]+\{)([\s\S]+?)(\}\s*\})/gm,
          (_, start, content, end) => {
            const newContent = (content as string).replace(
              /(?:[\s\r\n]*)?(?<prop>[\w-]+)\s*:\s*(?<value>[^};\r\n]+)/gm,
              (_, prop, value) => {
                return `${prop}: ${value} !important;`;
              },
            );
            return `${start}${newContent}${end}`;
          },
        );
      })
      // only return media queries
      .match(/@media\s*([^{]+)\{([^{}]*\{[^{}]*\})*[^{}]*\}/g)
      ?.join("") ?? ""
  );
}

/**
 * Make a map of all class names and their css styles
 */
function makeCssMap(css: string) {
  const cssNoMedia = css.replace(
    /@media[^{]+\{(?<content>[\s\S]+?)\}\s*\}/gm,
    "",
  );

  const cssMap = cssNoMedia.split("}").reduce(
    (acc, cur) => {
      const [key, value] = cur.split("{");
      if (key && value) {
        acc[key] = value;
      }
      return acc;
    },
    {} as Record<string, string>,
  );
  return cssMap;
}
