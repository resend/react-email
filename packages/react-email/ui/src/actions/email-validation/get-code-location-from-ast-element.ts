import type { HTMLElement } from 'node-html-parser';
import { getLineAndColumnFromOffset } from '../../utils/get-line-and-column-from-offset';

export interface CodeLocation {
  line: number;
  column: number;
}

export const getCodeLocationFromAstElement = (
  ast: HTMLElement,
  html: string,
): CodeLocation => {
  const [line, column] = getLineAndColumnFromOffset(ast.range[0], html);
  return {
    line,
    column,
  };
};
