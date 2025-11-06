import traverse from '@babel/traverse';
import { setupTailwind, type TailwindSetup } from '@react-email/tailwind';
import type { AST } from '../../../actions/email-validation/check-compatibility';
import { getTailwindConfig, type TailwindConfig } from './get-tailwind-config';

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
      tailwindSetup: TailwindSetup;
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
  const tailwindSetup = await setupTailwind(config);

  return {
    hasTailwind: true,
    config,
    tailwindSetup,
  };
};
