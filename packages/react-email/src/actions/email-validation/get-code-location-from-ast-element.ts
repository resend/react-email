import type { HTMLElement } from 'node-html-parser';

export interface CodeLocation {
  file: string;
  line: number;
  column: number;
}

export const getCodeLocationFromAstElement = (
  ast: HTMLElement,
): CodeLocation | undefined => {
  if (
    ast.attributes['data-preview-file'] === undefined ||
    ast.attributes['data-preview-line'] === undefined ||
    ast.attributes['data-preview-column'] === undefined
  ) {
    return undefined;
  }

  return {
    file: ast.attributes['data-preview-file'],
    line: Number.parseInt(ast.attributes['data-preview-line']),
    column: Number.parseInt(ast.attributes['data-preview-column']),
  };
};
