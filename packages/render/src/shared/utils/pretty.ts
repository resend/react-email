import type { Options, Plugin } from 'prettier';
import type { builders } from 'prettier/doc';
import html from 'prettier/plugins/html';
import { format } from 'prettier/standalone';

interface HtmlNode {
  type: 'element' | 'text' | 'ieConditionalComment';
  name?: string;
  sourceSpan: {
    start: { file: unknown[]; offset: number; line: number; col: number };
    end: { file: unknown[]; offset: number; line: number; col: number };
    details: null;
  };
  parent?: HtmlNode;
}

function recursivelyMapDoc(
  doc: builders.Doc,
  callback: (innerDoc: string | builders.DocCommand) => builders.Doc,
): builders.Doc {
  if (Array.isArray(doc)) {
    return doc.map((innerDoc) => recursivelyMapDoc(innerDoc, callback));
  }

  if (typeof doc === 'object') {
    if (doc.type === 'group') {
      return {
        ...doc,
        contents: recursivelyMapDoc(doc.contents, callback),
        expandedStates: recursivelyMapDoc(
          doc.expandedStates,
          callback,
        ) as builders.Doc[],
      };
    }

    if ('contents' in doc) {
      return {
        ...doc,
        contents: recursivelyMapDoc(doc.contents, callback),
      };
    }

    if ('parts' in doc) {
      return {
        ...doc,
        parts: recursivelyMapDoc(doc.parts, callback) as builders.Doc[],
      };
    }

    if (doc.type === 'if-break') {
      return {
        ...doc,
        breakContents: recursivelyMapDoc(doc.breakContents, callback),
        flatContents: recursivelyMapDoc(doc.flatContents, callback),
      };
    }
  }

  return callback(doc);
}

const modifiedHtml = { ...html } as Plugin;
if (modifiedHtml.printers) {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const previousPrint = modifiedHtml.printers.html.print;
  modifiedHtml.printers.html.print = (path, options, print, args) => {
    const node = path.getNode() as HtmlNode;

    const rawPrintingResult = previousPrint(path, options, print, args);

    if (node.type === 'ieConditionalComment') {
      const printingResult = recursivelyMapDoc(rawPrintingResult, (doc) => {
        if (typeof doc === 'object' && doc.type === 'line') {
          return doc.soft ? '' : ' ';
        }

        return doc;
      });

      return printingResult;
    }

    return rawPrintingResult;
  };
}

const defaults: Options = {
  endOfLine: 'lf',
  tabWidth: 2,
  plugins: [modifiedHtml],
  bracketSameLine: true,
  parser: 'html',
};

export const pretty = (str: string, options: Options = {}) => {
  return format(str.replaceAll('\0', ''), {
    ...defaults,
    ...options,
  });
};
