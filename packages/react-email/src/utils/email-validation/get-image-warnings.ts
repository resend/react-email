import traverse from '@babel/traverse';
import type { EmailValidationWarning } from '../../actions/get-warnings-for-email';
import { getLineAndColumnFromIndex } from './get-line-and-column-from-index';
import type { AST } from '.';

export const getImageWarnings = (ast: AST, code: string) => {
  const warnings: EmailValidationWarning[] = [];

  traverse(ast, {
    JSXOpeningElement(path) {
      if (
        !path.node.attributes.some(
          (attrib) =>
            attrib.type === 'JSXAttribute' && attrib.name.name === 'alt',
        )
      ) {
        const [line, column] = getLineAndColumnFromIndex(
          code,
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          path.node.start!,
        );
        warnings.push({
          message: 'missing alt text',
          line,
          column,
        });
      }
    },
  });

  return warnings;
};
