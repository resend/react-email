import { type Rule, walk } from 'css-tree';
import React from 'react';
import { getElementOptions } from '../../../element-marker.js';
import type { EmailElementProps } from '../../tailwind.js';
import { sanitizeClassName } from '../compatibility/sanitize-class-name.js';
import type { CustomProperties } from '../css/get-custom-properties.js';
import { makeInlineStylesFor } from '../css/make-inline-styles-for.js';
import { isComponent } from '../react/is-component.js';

export function cloneElementWithInlinedStyles(
  element: React.ReactElement<EmailElementProps>,
  inlinableRules: Map<string, Rule[]>,
  nonInlinableRules: Map<string, Rule[]>,
  customProperties: CustomProperties,
) {
  if (!element.props.className || isComponent(element)) {
    return React.cloneElement(element, element.props, element.props.children);
  }

  const classes = element.props.className.trim().split(/\s+/);

  const residualClasses: string[] = [];
  const classProperties: Record<string, string[]> = {};

  const rules: Rule[] = [];
  for (const className of classes) {
    const classRules = inlinableRules.get(className);
    if (classRules) {
      rules.push(...classRules);
    }
    const nonInlinable = nonInlinableRules.get(className);
    if (nonInlinable) {
      const sanitized = sanitizeClassName(className);
      residualClasses.push(sanitized);
      const properties: string[] = [];
      for (const rule of nonInlinable) {
        walk(rule, {
          visit: 'Declaration',
          enter(declaration) {
            properties.push(declaration.property);
          },
        });
      }
      classProperties[sanitized] = properties;
    } else if (!classRules) {
      residualClasses.push(className);
    }
  }

  const resolved = {
    style: {
      ...makeInlineStylesFor(rules, customProperties),
      ...element.props.style,
    },
    className:
      residualClasses.length > 0 ? residualClasses.join(' ') : undefined,
    classProperties,
  };

  const resolveTailwind = getElementOptions(element.type)?.resolveTailwind;
  const newProps = resolveTailwind
    ? (resolveTailwind(element.props, resolved) as EmailElementProps)
    : {
        ...element.props,
        style: resolved.style,
        className: resolved.className,
      };

  return React.cloneElement(element, newProps, newProps.children);
}
