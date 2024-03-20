import React from "react";
import type { Node } from "postcss";
import type { EmailElementProps } from "../tailwind";
import { sanitizeDeclarations } from "../utils/css/sanitize-declarations";
import { sanitizeMediaQueries } from "../utils/css/media-queries/sanitize-media-queries";
import { makeInlineStylesFor } from "../utils/css/make-inline-styles-for";
import { sanitizeClassName } from "../utils/compatibility/sanitize-class-name";
import type { useTailwind } from "./use-tailwind";

export const useCloneElementWithInlinedStyles = (
  tailwind: ReturnType<typeof useTailwind>,
) => {
  return (element: React.ReactElement<EmailElementProps>) => {
    const propsToOverwrite = {} as Partial<EmailElementProps>;

    let nonInlinableClasses: string[] = [];
    let nonInlineStyleNodes: Node[] = [];

    if (element.props.className) {
      const rootForClasses = tailwind.generateRootForClasses(
        element.props.className.split(" "),
      );
      sanitizeDeclarations(rootForClasses);

      const { sanitizedAtRules, mediaQueryClasses } =
        sanitizeMediaQueries(rootForClasses);
      nonInlinableClasses = mediaQueryClasses;
      nonInlineStyleNodes = sanitizedAtRules;

      const { styles, residualClassName } = makeInlineStylesFor(
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
      ...propsToOverwrite,
    };

    return {
      elementWithInlinedStyles: React.cloneElement(
        element,
        newProps,
        newProps.children,
      ),

      nonInlinableClasses,
      nonInlineStyleNodes,
    };
  };
};
