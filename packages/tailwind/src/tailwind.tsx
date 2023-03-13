import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import htmlParser, { attributesToProps, Element } from "html-react-parser";
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

  const headStyle = getMediaQueryCSS(
    twi(fullHTML, {
      merge: false,
      ignoreMediaQueries: false,
    })
  );

  const hasResponsiveStyles = /@media[^{]+\{(?<content>[\s\S]+?)\}\s*\}/gm.test(
    headStyle
  );
  const hasHTML = /<html[^>]*>/gm.test(fullHTML);
  const hasHead = /<head[^>]*>/gm.test(fullHTML);

  if (hasResponsiveStyles && !hasHTML && !hasHead) {
    throw new Error(
      "Tailwind: To use responsive styles you must have a <html> and <head> element in your template."
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
              const style = domNode.children.find(
                (child) => child instanceof Element && child.name === "style"
              );

              const props = attributesToProps(domNode.attribs);

              newDomNode = (
                <head {...props}>
                  {style && style instanceof Element ? (
                    <style>{`${style.children} ${headStyle}`}</style>
                  ) : (
                    <style>{headStyle}</style>
                  )}
                </head>
              );
            }

            return newDomNode;
          }

          if (domNode.attribs?.class) {
            if (hasResponsiveStyles) {
              domNode.attribs.class = domNode.attribs.class.replace(
                /[:#\!\-[\]\/\.%]+/g,
                "_"
              );
            } else {
              const currentStyles = domNode.attribs.style
                ? `${domNode.attribs.style};`
                : "";
              const tailwindStyles = twi(domNode.attribs.class);
              domNode.attribs.style = `${currentStyles} ${tailwindStyles}`;
              delete domNode.attribs.class;
            }
          }
        }
      },
    });

    return parsedHTML;
  });

  return <>{reactHTML}</>;
};

Tailwind.displayName = "Tailwind";

function getMediaQueryCSS(css: string) {
  const mediaQueryRegex = /@media[^{]+\{(?<content>[\s\S]+?)\}\s*\}/gm;

  let newCss = css
    .replace(mediaQueryRegex, (m) => {
      return m.replace(
        /([^{]+\{)([\s\S]+?)(\}\s*\})/gm,
        (_, start, content, end) => {
          const newcontent = (content as string).replace(
            /(?:[\s\r\n]*)?(?<prop>[\w-]+)\s*:\s*(?<value>[^;\r\n]+)/gm,
            (_, prop, value) => {
              return `${prop}: ${value} !important`;
            }
          );

          return `${start}${newcontent}${end}`;
        }
      );
    })
    .replace(/[.\!\#\w\d\\:\-\[\]\/\.%]+\s*?{/g, (m) => {
      return m.replace(/(?<=.)[:#\!\-[\\\]\/\.%]+/g, "_");
    })
    .replace(/font-family(?<value>[^;\r\n]+)/g, (m, value) => {
      return `font-family${value.replace(/['"]+/g, "")}`;
    });

  return newCss;
}
