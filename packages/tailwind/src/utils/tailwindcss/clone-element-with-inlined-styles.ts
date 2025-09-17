import { generate, type CssNode } from 'css-tree';
import React from 'react';
import type { EmailElementProps } from '../../tailwind';
import { sanitizeClassName } from '../compatibility/sanitize-class-name';
import { makeInlineStylesFor } from '../css/make-inline-styles-for';
import { isComponent } from '../react/is-component';
import type { TailwindSetup } from './setup-tailwind';
import { extractRulesMatchingStyles } from '../css/extract-rules-matching-classes';

export const cloneElementWithInlinedStyles = (
  element: React.ReactElement<EmailElementProps>,
  tailwindSetup: TailwindSetup,
) => {
  const propsToOverwrite: Partial<EmailElementProps> = {};

  const nonInlinableClasses: string[] = [];
  const nonInlineRules: CssNode[] = [];

  if (element.props.className) {
    const classes = element.props.className.split(' ');
    const cssNode = tailwindSetup.aggregateIntoCss(classes);
    tailwindSetup.dealWithCompatibilityIssues(cssNode);

    const rulePerClass = extractRulesMatchingStyles(classes, cssNode);

    /** Includes both user-defined classes that we need to persist, as well as classes for non-inlinable rules */
    const residualClasses: string[] = [];
    for (const className of classes) {
      const rule = rulePerClass.get(className);
      if (rule === undefined || !rule.inlinable) {
        residualClasses.push(className);
      }
      if (rule && !rule.inlinable) {
        nonInlinableClasses.push(className);
      }
    }
    const inlinableRules: CssNode[] = rulePerClass
      .values()
      .filter((r) => r.inlinable)
      .map((r) => r.rule)
      .toArray();
    const styles = makeInlineStylesFor(inlinableRules);
    propsToOverwrite.style = {
      ...styles,
      ...element.props.style,
    };

    if (!isComponent(element)) {
      if (residualClasses.length > 0) {
        propsToOverwrite.className = residualClasses.join(' ');

        /*
          We sanitize only the class names of Tailwind classes that we are not going to inline
          to avoid unpredictable behavior on the user's code. If we did sanitize all classes
          a user-defined class could end up also being sanitized which would lead to unexpected
          behavior and bugs that are hard to track.
        */
        for (const className of nonInlinableClasses) {
          propsToOverwrite.className = propsToOverwrite.className.replace(
            className,
            sanitizeClassName(className),
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
    nonInlineRules,
  };
};
