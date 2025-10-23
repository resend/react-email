import { type CssNode, type Declaration, generate, walk } from 'css-tree';

export interface CustomProperty {
  syntax?: Declaration;
  inherits?: Declaration;
  initialValue?: Declaration;
}

export type CustomProperties = Map<string, CustomProperty>;

export function getCustomProperties(node: CssNode) {
  const customProperties = new Map<string, CustomProperty>();

  walk(node, {
    visit: 'Atrule',
    enter(atrule) {
      if (atrule.name === 'property' && atrule.prelude) {
        const prelude = generate(atrule.prelude);
        if (prelude.startsWith('--')) {
          let syntax: Declaration | undefined;
          let inherits: Declaration | undefined;
          let initialValue: Declaration | undefined;
          walk(atrule, {
            visit: 'Declaration',
            enter(declaration) {
              if (declaration.property === 'syntax') {
                syntax = declaration;
              }
              if (declaration.property === 'inherits') {
                inherits = declaration;
              }
              if (declaration.property === 'initial-value') {
                initialValue = declaration;
              }
            },
          });

          customProperties.set(prelude, {
            syntax,
            inherits,
            initialValue,
          });
        }
      }
    },
  });

  return customProperties;
}
