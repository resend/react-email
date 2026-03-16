import { promises as fs } from 'node:fs';
import path from 'node:path';
import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import { pretty, render } from '@react-email/components';
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
  code: Partial<Record<CodeVariant, string>> & {
    html: string;
    /**
     * Present for snippet components (type !== 'document').
     * Contains only the inner HTML fragment without the full document wrapper,
     * suitable for copy-pasting into an existing email template.
     * Document components use `html` which contains the full HTML email document.
     */
    htmlSnippet?: string;
  };
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

/**
 * Extracts the inner HTML fragment from a full rendered HTML document,
 * stripping the DOCTYPE declaration and all HTML comments (including
 * React hydration markers such as <!--$--> and <!--/$-->).
 */
const extractHtmlSnippet = (fullHtml: string): string => {
  return fullHtml
    .replace(/<!DOCTYPE[^>]*>\s*/i, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .trim();
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
  const isDocument = component.type === 'document';

  if (variantFilenames.length === 1 && variantFilenames[0] === 'index.tsx') {
    const filePath = path.join(dirpath, 'index.tsx');
    const componentElement = await getComponentElement(filePath);
    const layoutElement = <Layout>{componentElement}</Layout>;
    const html = await pretty(await render(layoutElement));
    const fileContent = await fs.readFile(filePath, 'utf8');
    const code = getComponentCodeFrom(fileContent);

    const result: ImportedComponent = {
      ...component,
      code: { react: code, html },
    };

    if (!isDocument) {
      result.code.htmlSnippet = extractHtmlSnippet(
        await pretty(await render(componentElement)),
      );
    }

    return result;
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

  const layoutElement = <Layout>{elements[0]}</Layout>;
  codePerVariant.html = await pretty(await render(layoutElement));

  if (!isDocument) {
    codePerVariant.htmlSnippet = extractHtmlSnippet(
      await pretty(await render(elements[0])),
    );
  }

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
