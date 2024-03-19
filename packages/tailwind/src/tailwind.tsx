import * as React from "react";
import type { Config as TailwindOriginalConfig } from "tailwindcss";
import { Root } from "postcss";
import { inlineStyles } from "./utils/css/inline-styles";
import { sanitizeClassName } from "./utils/compatibility/sanitize-class-name";
import { minifyCss } from "./utils/css/minify-css";
import { useTailwind } from "./hooks/use-tailwind";
import { sanitizeMediaQueries } from "./utils/css/media-queries/sanitize-media-queries";
import { sanitizeDeclarations } from "./utils/css/sanitize-declarations";

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
  const tailwind = useTailwind(config ?? {});

  const nonInlineStylesRootToApply = new Root();
  const mediaQueryClassesForAllElement: string[] = [];
  let hasNonInlineStylesToApply = false as boolean;

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
      const rootForClasses = tailwind.generateRootForClasses(
        element.props.className.split(" "),
      );
      sanitizeDeclarations(rootForClasses);

      const { sanitizedAtRules, mediaQueryClasses } =
        sanitizeMediaQueries(rootForClasses);
      mediaQueryClassesForAllElement.push(...mediaQueryClasses);
      nonInlineStylesRootToApply.append(...sanitizedAtRules);

      if (mediaQueryClasses.length > 0 && !hasNonInlineStylesToApply) {
        hasNonInlineStylesToApply = true;
      }

      const { styles, residualClassName } = inlineStyles(
        element.props.className,
        rootForClasses,
      );
      propsToOverwrite.style = {
        ...element.props.style,
        ...styles,
      };

      if (residualClassName.trim().length > 0) {
        propsToOverwrite.className = residualClassName;

        /*
          We sanitize only the class names of Tailwind classes that we are not going to inline
          to avoid unpredictable behavior on the user's code. If we did sanitize all classes
          a user-defined class could end up also being sanitized which would lead to unexpected 
          behavior and bugs that are hard to track.
        */
        for (const singleClass of mediaQueryClasses) {
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
      ...propsToOverwrite
    };
    const newChildren = propsToOverwrite.children
      ? propsToOverwrite.children
      : element.props.children;

    if (typeof element.type === "function") {
      const OriginalComponent = element.type as React.FC;

      return React.createElement(
        (props: EmailElementProps) => {
          const renderedComponent = OriginalComponent(props);
          if (React.isValidElement<EmailElementProps>(renderedComponent)) {
            return processElement(renderedComponent);
          }
          return renderedComponent;
        },
        newProps,
        newChildren,
      );
    }

    return React.cloneElement(element, newProps, newChildren);
  }

  let childrenArray =
    React.Children.map(children, (child) => {
      if (React.isValidElement<EmailElementProps>(child)) {
        const element = child;

        return processElement(element);
      }

      return child;
    }) ?? [];

  let hasAppliedNonInlineStyles = false as boolean;

  if (hasNonInlineStylesToApply) {
    const processElementToApplyNonInlineStyles = (
      element: React.ReactElement<EmailElementProps>
    ): React.ReactElement<EmailElementProps> => {
      if (!hasAppliedNonInlineStyles && hasNonInlineStylesToApply) {
        let newChildren = element.props.children;
        // if it has children and is not the head element,
        // then it goes through all the children trying to process them
        // to find the <head> element
        if (element.props.children && element.type !== "head") {
          newChildren = React.Children.map(element.props.children, (child) => {
            if (React.isValidElement<EmailElementProps>(child)) {
              return processElementToApplyNonInlineStyles(child);
            }

            return child;
          });
        }

        if (typeof element.type === "function") {
          const OriginalComponent = element.type as React.FC;

          return React.createElement(
            (props: EmailElementProps) => {
              const renderedComponent = OriginalComponent(props);
              if (React.isValidElement<EmailElementProps>(renderedComponent)) {
                return processElementToApplyNonInlineStyles(renderedComponent);
              }

              return renderedComponent;
            },
            { ...element.props, key: element.key },
            newChildren,
          );
        }

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

        return React.cloneElement(element, { ...element.props, key: element.key }, newChildren);
      }

      return element;
    };
    childrenArray = childrenArray.map((child) => {
      if (React.isValidElement<EmailElementProps>(child)) {
        return processElementToApplyNonInlineStyles(child);
      }

      return child;
    });
  }

  React.useEffect(() => {
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
  });

  return <>{childrenArray}</>;
};
