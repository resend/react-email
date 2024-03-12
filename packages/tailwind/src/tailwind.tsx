import * as React from "react";
import type { Config as TailwindOriginalConfig } from "tailwindcss";
import { useTailwindStyles } from "./hooks/use-tailwind-styles";
import { useStyleInlining } from "./hooks/use-style-inlining";
import { sanitizeClassName } from "./utils/compatibility/sanitize-class-name";
import { minifyCss } from "./utils/css/minify-css";

export type TailwindConfig = Omit<TailwindOriginalConfig, "content">;

export interface TailwindProps {
  children: React.ReactNode;
  config?: TailwindConfig;
}

interface EmailElementProps {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const Tailwind: React.FC<TailwindProps> = ({ children, config }) => {
  const { stylePerClassMap, nonInlinableClasses, sanitizedMediaQueries } =
    useTailwindStyles(children, config ?? {});

  const inline = useStyleInlining(stylePerClassMap);

  const nonInlineStylesToApply = sanitizedMediaQueries.filter(
    (style) => style.trim().length > 0,
  );

  function processElement(
    element: React.ReactElement<EmailElementProps>,
  ): React.ReactElement<EmailElementProps> {
    const propsToOverwrite = {} as Partial<EmailElementProps>;

    if (element.props.children) {
      propsToOverwrite.children = React.Children.map(
        element.props.children,
        (child) => {
          if (React.isValidElement<EmailElementProps>(child)) {
            return processElement(child);
          }

          return child;
        },
      );
    }

    if (element.props.className) {
      const { styles, residualClassName } = inline(element.props.className);
      propsToOverwrite.style = {
        ...element.props.style,
        ...styles,
      };
      if (residualClassName.trim().length > 0) {
        propsToOverwrite.className = residualClassName;
        /*
          We sanitize only the class names of Tailwind classes that we are not going to inline
          to avoid unpredictable behavior on the user's code. If we did sanitize all class names
          a user-defined class could end up also being sanitized which would lead to unexpected 
          behavior and bugs that are hard to track.
        */
        for (const singleClass of nonInlinableClasses) {
          propsToOverwrite.className = propsToOverwrite.className.replace(
            singleClass,
            sanitizeClassName(singleClass),
          );
        }
      } else {
        propsToOverwrite.className = undefined;
      }
    }

    const newProps = {
      ...element.props,
      ...propsToOverwrite,
    };
    const newChildren = propsToOverwrite.children
      ? propsToOverwrite.children
      : element.props.children;

    if (typeof element.type === "function") {
      const component = element.type as React.FC;
      const renderedComponent = component({
        ...element.props,
        ...propsToOverwrite,
      });

      if (React.isValidElement<EmailElementProps>(renderedComponent)) {
        return processElement(renderedComponent);
      }
    }

    return React.cloneElement(element, newProps, newChildren);
  }

  const hasNonInlineStylesToApply = nonInlineStylesToApply.length > 0;
  let hasAppliedNonInlineStyles = false as boolean;

  const childrenArray =
    React.Children.map(children, (child) => {
      if (React.isValidElement<EmailElementProps>(child)) {
        const element = child;

        if (!hasAppliedNonInlineStyles && hasNonInlineStylesToApply) {
          if (
            element.type === "head" ||
            (typeof element.type === "function" &&
              "name" in element.type &&
              element.type.name === "Head")
          ) {
            hasAppliedNonInlineStyles = true;

            /*                   only minify here since it is the only place that is going to be in the DOM */
            const styleElement = (
              <style>{minifyCss(nonInlineStylesToApply.join(""))}</style>
            );

            return React.cloneElement(
              element,
              element.props,
              element.props.children,
              styleElement,
            );
          }
        }

        return processElement(element);
      }
    }) ?? [];

  if (hasNonInlineStylesToApply && !hasAppliedNonInlineStyles) {
    throw new Error(
      "Tailwind: To use responsive styles you must have a <head> element as a direct child of the Tailwind component.",
    );
  }

  return <>{childrenArray}</>;
};
