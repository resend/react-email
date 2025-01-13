import type { Node } from 'postcss';
import React from 'react';
import type { EmailElementProps } from '../../tailwind';
import { sanitizeClassName } from '../compatibility/sanitize-class-name';
import { makeInlineStylesFor } from '../css/make-inline-styles-for';
import { sanitizeMediaQueries } from '../css/media-queries/sanitize-media-queries';
import { sanitizePseudoClasses } from '../css/pseudo-classes/sanitize-pseudo-classes';
import { sanitizeDeclarations } from '../css/sanitize-declarations';
import { isComponent } from '../react/is-component';
import type { setupTailwind } from './setup-tailwind';

export const cloneElementWithInlinedStyles = (
  element: React.ReactElement<EmailElementProps>,
  tailwind: ReturnType<typeof setupTailwind>,
) => {
  const propsToOverwrite: Partial<EmailElementProps> = {};

  let nonInlinableClasses: string[] = [];
  let nonInlineStyleNodes: Node[] = [];

  if (element.props.className) {
    const rootForClasses = tailwind.generateRootForClasses(
      element.props.className.split(' '),
    );
    sanitizeDeclarations(rootForClasses);

    const { sanitizedAtRules, mediaQueryClasses } =
      sanitizeMediaQueries(rootForClasses);
    nonInlinableClasses = mediaQueryClasses;
    nonInlineStyleNodes = sanitizedAtRules;

    const { sanitizedPseudoClassRules, pseudoClassClasses } =
      sanitizePseudoClasses(rootForClasses);
    nonInlinableClasses.push(...pseudoClassClasses);
    nonInlineStyleNodes.push(...sanitizedPseudoClassRules);

    const { styles, residualClassName } = makeInlineStylesFor(
      element.props.className,
      rootForClasses,
    );
    propsToOverwrite.style = {
      ...styles,
      ...element.props.style,
    };

    if (!isComponent(element)) {
      if (residualClassName.trim().length > 0) {
        propsToOverwrite.className = residualClassName;

        /*
          We sanitize only the class names of Tailwind classes that we are not going to inline
          to avoid unpredictable behavior on the user's code. If we did sanitize all classes
          a user-defined class could end up also being sanitized which would lead to unexpected
          behavior and bugs that are hard to track.
        */
        for (const singleClass of [
          ...mediaQueryClasses,
          ...pseudoClassClasses,
        ]) {
          propsToOverwrite.className = propsToOverwrite.className.replace(
            singleClass,
            sanitizeClassName(singleClass),
          );
        }
      } else {
        propsToOverwrite.className = undefined;
      }
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
