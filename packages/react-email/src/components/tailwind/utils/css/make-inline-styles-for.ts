import {
  type CssNode,
  clone,
  type Declaration,
  generate,
  parse,
  type Value,
  walk,
} from 'css-tree';
import { getReactProperty } from '../compatibility/get-react-property.js';
import type { CustomProperties } from './get-custom-properties.js';
import { resolveCalcExpressions } from './resolve-calc-expressions.js';
import { sanitizeDeclarations } from './sanitize-declarations.js';
import { stripEmptyTailwindVars } from './strip-empty-tailwind-vars.js';
import { unwrapValue } from './unwrap-value.js';

export function makeInlineStylesFor(
  inlinableRules: CssNode[],
  customProperties: CustomProperties,
) {
  const styles: Record<string, string> = {};
  // Rules are shared by every element using a class. Resolving one element's
  // colors must not mutate the rules used by its siblings.
  const rules = inlinableRules.map((rule) => clone(rule));

  const localVariableDeclarations = new Map<string, Declaration>();
  for (const rule of rules) {
    walk(rule, {
      visit: 'Declaration',
      enter(declaration) {
        if (declaration.property.startsWith('--')) {
          localVariableDeclarations.set(declaration.property, declaration);
        }
      },
    });
  }

  const resolveValue = (
    value: CssNode,
    resolving = new Set<string>(),
  ): CssNode => {
    const resolved = parse(generate(value), { context: 'value' }) as Value;
    walk(resolved, {
      visit: 'Function',
      leave(func, item) {
        if (func.name !== 'var') return;
        const children = func.children.toArray();
        const name = children[0] ? generate(children[0]).trim() : '';
        if (resolving.has(name)) return;

        const definition = localVariableDeclarations.get(name);
        const initialValue = customProperties.get(name)?.initialValue;
        const comma = children.findIndex(
          (child) => child.type === 'Operator' && child.value === ',',
        );
        const fallback =
          comma === -1
            ? undefined
            : children
                .slice(comma + 1)
                .map((child) => generate(child))
                .join('');
        const replacement = definition?.value ?? initialValue?.value;
        if (replacement) {
          item.data = unwrapValue(
            resolveValue(replacement, new Set([...resolving, name])) as Value,
          );
        } else if (fallback) {
          const declaration: Declaration = {
            type: 'Declaration',
            property: 'value',
            important: false,
            value: resolveValue(
              parse(fallback, { context: 'value' }),
              resolving,
            ) as Value,
          };
          sanitizeDeclarations(declaration);
          item.data = unwrapValue(declaration.value);
        }
      },
    });
    return resolved;
  };

  for (const rule of rules) {
    walk(rule, {
      visit: 'Declaration',
      enter(declaration) {
        if (declaration.property.startsWith('--')) {
          return;
        }
        declaration.value = resolveValue(declaration.value) as Value;
        resolveCalcExpressions(declaration);
        stripEmptyTailwindVars(declaration.value);

        styles[getReactProperty(declaration.property)] =
          generate(declaration.value).trim() +
          (declaration.important ? '!important' : '');
      },
    });
  }

  return styles;
}
