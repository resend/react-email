import traverse from '@babel/traverse';
import {
  setupTailwind,
  type TailwindConfig,
  type TailwindSetup,
} from 'react-email';
import type { AST } from '../../../actions/email-validation/check-compatibility';
import {
  getTailwindConfig,
  getTailwindCSSConfigs,
  type TailwindCSSConfigs,
} from './get-tailwind-config';

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
      cssConfigs: TailwindCSSConfigs;
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

  const [config, cssConfigs] = await Promise.all([
    getTailwindConfig(sourceCode, ast, sourcePath),
    getTailwindCSSConfigs(sourceCode, ast, sourcePath),
  ]);
  const tailwindSetup = await setupTailwind({
    config,
    cssConfigs,
  });

  return {
    hasTailwind: true,
    config,
    cssConfigs,
    tailwindSetup,
  };
};
