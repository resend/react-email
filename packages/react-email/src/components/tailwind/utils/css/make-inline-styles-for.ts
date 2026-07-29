import { type CssNode, type Declaration, generate, walk } from 'css-tree';
import { getReactProperty } from '../compatibility/get-react-property.js';
import type { CustomProperties } from './get-custom-properties.js';
import { resolveVariableFunctions } from './resolve-variable-functions.js';
import { stripEmptyTailwindVars } from './strip-empty-tailwind-vars.js';

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

  for (const rule of inlinableRules) {
    walk(rule, {
      visit: 'Declaration',
      enter(declaration) {
        if (declaration.property.startsWith('--')) {
          return;
        }

        resolveVariableFunctions(
          declaration.value,
          localVariableDeclarations,
          customProperties,
        );
        stripEmptyTailwindVars(declaration.value);

        styles[getReactProperty(declaration.property)] =
          generate(declaration.value).trim() +
          (declaration.important ? '!important' : '');
      },
    });
  }

  return styles;
}
