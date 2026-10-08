import {
  type CssNode,
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

function hasVarFunction(node: CssNode) {
  let found = false;
  walk(node, {
    visit: 'Function',
    enter(func) {
      if (func.name === 'var') {
        found = true;
        return this.break;
      }
    },
  });
  return found;
}

export function makeInlineStylesFor(
  inlinableRules: CssNode[],
  customProperties: CustomProperties,
) {
  const styles: Record<string, string> = {};

  const localVariableDeclarations = new Map<string, Declaration>();
  for (const rule of inlinableRules) {
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

  for (const rule of inlinableRules) {
    walk(rule, {
      visit: 'Declaration',
      enter(declaration) {
        if (declaration.property.startsWith('--')) {
          return;
        }
        let value: CssNode = declaration.value;
        if (hasVarFunction(value)) {
          value = resolveValue(value);
          resolveCalcExpressions(value);
          stripEmptyTailwindVars(value);
        }

        styles[getReactProperty(declaration.property)] =
          generate(value).trim() + (declaration.important ? '!important' : '');
      },
    });
  }

  return styles;
}
