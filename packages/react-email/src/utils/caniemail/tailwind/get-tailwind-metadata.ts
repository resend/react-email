import type { JitContext } from 'tailwindcss/lib/lib/setupContextUtils';
import traverse from '@babel/traverse';
import type { AST } from '../../../actions/get-insights-for-email';
import { getTailwindConfig, type TailwindConfig } from './get-tailwind-config';
import { setupTailwindContext } from './setup-tailwind-context';

export const getTailwindMetadata = (
  ast: AST,
  sourceCode: string,
  sourcePath: string,
):
  | {
      hasTailwind: false;
    }
  | {
      hasTailwind: true;
      config: TailwindConfig;
      context: JitContext;
    } => {
  let hasTailwind = false as boolean;
  traverse(ast, {
    JSXOpeningElement(path) {
      if (
        path.node.name.type === 'JSXIdentifier' &&
        path.node.name.name === 'Tailwind'
      ) {
        hasTailwind = true;
      }
    },
  });

  if (!hasTailwind) {
    return { hasTailwind: false };
  }

  const config = getTailwindConfig(sourceCode, ast, sourcePath);
  const context = setupTailwindContext(config);

  return {
    hasTailwind: true,
    config,
    context,
  };
};
