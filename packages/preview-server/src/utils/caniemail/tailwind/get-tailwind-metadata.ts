import traverse from '@babel/traverse';
import type { JitContext } from 'tailwindcss/lib/lib/setupContextUtils';
import type { AST } from '../../../actions/email-validation/check-compatibility';
import { getTailwindConfig, type TailwindConfig } from './get-tailwind-config';
import { setupTailwindContext } from './setup-tailwind-context';

export const getTailwindMetadata = async (
  ast: AST,
  sourceCode: string,
  sourcePath: string,
): Promise<
  | {
      hasTailwind: false;
    }
  | {
      hasTailwind: true;
      config: TailwindConfig;
      context: JitContext;
    }
> => {
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

  const config = await getTailwindConfig(sourceCode, ast, sourcePath);
  const context = setupTailwindContext(config);

  return {
    hasTailwind: true,
    config,
    context,
  };
};
