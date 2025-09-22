import type { Rule } from 'css-tree';
import React from 'react';
import type { EmailElementProps } from '../../tailwind';
import { sanitizeClassName } from '../compatibility/sanitize-class-name';
import { makeInlineStylesFor } from '../css/make-inline-styles-for';
import { isComponent } from '../react/is-component';

export function cloneElementWithInlinedStyles(
  element: React.ReactElement<EmailElementProps>,
  inlinableRules: Map<string, Rule>,
  nonInlinableRules: Map<string, Rule>,
) {
  const propsToOverwrite: Partial<EmailElementProps> = {};

  if (element.props.className && !isComponent(element)) {
    const classes = element.props.className.split(' ');

    const residualClasses: string[] = [];

    const rules: Rule[] = [];
    for (const className of classes) {
      const rule = inlinableRules.get(className);
      if (rule) {
        rules.push(rule);
      } else {
        residualClasses.push(className);
      }
    }

    const styles = makeInlineStylesFor(rules);
    propsToOverwrite.style = {
      ...styles,
      ...element.props.style,
    };

    if (residualClasses.length > 0) {
      propsToOverwrite.className = residualClasses
        .map((className) => {
          if (nonInlinableRules.has(className)) {
            return sanitizeClassName(className);
          }
          return className;
        })
        .join(' ');
    } else {
      propsToOverwrite.className = undefined;
    }
  }

  const newProps = {
    ...element.props,
    ...propsToOverwrite,
  };

  return React.cloneElement(element, newProps, newProps.children);
}
