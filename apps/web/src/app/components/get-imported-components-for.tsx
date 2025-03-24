import { promises as fs } from 'node:fs';
import path from 'node:path';
import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import { render } from '@react-email/components';
import { z } from 'zod';
import { Layout } from '../../../components/_components/layout';
import type { Category, Component } from '../../../components/structure';
import {
  getComponentPathFromSlug,
  pathToComponents,
} from '../../../components/structure';

/**
 * Tailwind and Inline Styles are both with React, but the React
 * option is meant for where Tailwind nor Inline Styles are used
 * at all in the markup.
 */
export type CodeVariant = 'tailwind' | 'inline-styles' | 'react' | 'html';

export interface ImportedComponent extends Component {
  code: Partial<Record<CodeVariant, string>> & { html: string };
}

const ComponentModule = z.object({
  component: z.record(z.string(), z.any()),
});

const getComponentCodeFrom = (fileContent: string): string => {
  const parsedContents = parse(fileContent, {
    sourceType: 'unambiguous',
    strictMode: false,
    errorRecovery: true,
    plugins: ['jsx', 'typescript', 'decorators'],
  });

  let componentCode: string | undefined;
  traverse(parsedContents, {
    VariableDeclarator({ node }) {
      if (
        node.id.type === 'Identifier' &&
        node.id.name === 'component' &&
        (node.init?.type === 'JSXElement' || node.init?.type === 'JSXFragment')
      ) {
        const expression = node.init;
        if (expression.start !== null && expression.end !== null) {
          componentCode = fileContent.slice(expression.start, expression.end);
        }
      }
    },
  });

  if (!componentCode) {
    throw new Error('Could not find the source code for the component');
  }

  return componentCode
    .split(/\r\n|\r|\n/)
    .map((line) => line.replace(/^\s{2}/, ''))
    .join('\n');
};

export const getComponentElement = async (
  filepath: string,
): Promise<React.ReactElement> => {
  const relativeFilepath = path.relative(pathToComponents, filepath);
  const patternModule = ComponentModule.parse(
    await import(
      `../../../components/${relativeFilepath.replace(
        path.extname(relativeFilepath),
        '',
      )}`
    ),
  );
  return patternModule.component as React.ReactElement;
};

export const getImportedComponent = async (
  component: Component,
): Promise<ImportedComponent> => {
  const dirpath = getComponentPathFromSlug(component.slug);
  const variantFilenames = await fs.readdir(dirpath);

  if (variantFilenames.length === 1 && variantFilenames[0] === 'index.tsx') {
    const filePath = path.join(dirpath, 'index.tsx');
    const element = <Layout>{await getComponentElement(filePath)}</Layout>;
    const html = await render(element, {
      pretty: true,
    });
    const fileContent = await fs.readFile(filePath, 'utf8');
    const code = getComponentCodeFrom(fileContent);
    return {
      ...component,
      code: {
        react: code,
        html,
      },
    };
  }

  const codePerVariant: ImportedComponent['code'] = { html: '' };

  const elements = await Promise.all(
    variantFilenames.map(async (variantFilename) => {
      const filePath = path.join(dirpath, variantFilename);
      return getComponentElement(filePath);
    }),
  );

  const fileContents = await Promise.all(
    variantFilenames.map(async (variantFilename) => {
      const filePath = path.join(dirpath, variantFilename);
      return fs.readFile(filePath, 'utf8');
    }),
  );

  variantFilenames.forEach((variantFilename, index) => {
    const variantKey = variantFilename.replace('.tsx', '') as CodeVariant;
    codePerVariant[variantKey] = getComponentCodeFrom(fileContents[index]);
  });

  const element = <Layout>{elements[0]}</Layout>;

  codePerVariant.html = await render(element, {
    pretty: true,
  });

  return {
    ...component,
    code: codePerVariant,
  };
};

export const getImportedComponentsFor = async (
  category: Category,
): Promise<ImportedComponent[]> => {
  return Promise.all(
    category.components.map((component) => getImportedComponent(component)),
  );
};
