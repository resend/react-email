import type { Options, Plugin } from 'prettier';
import type { builders } from 'prettier/doc';

interface HtmlNode {
  type?: 'element' | 'text' | 'ieConditionalComment';
  kind?: 'element' | 'text' | 'ieConditionalComment' | 'root';
  name?: string;
  sourceSpan: {
    start: { file: unknown[]; offset: number; line: number; col: number };
    end: { file: unknown[]; offset: number; line: number; col: number };
    details: null;
  };
  parent?: HtmlNode;
}

function getHtmlNode(path: {
  node?: HtmlNode;
  stack?: Array<Record<string, unknown>>;
}) {
  const topNode = path.node;
  if (topNode) {
    return topNode;
  }

  return path.stack?.[path.stack.length - 1] as unknown as HtmlNode;
}

function recursivelyMapDoc(
  doc: builders.Doc,
  callback: (innerDoc: string | builders.DocCommand) => builders.Doc,
): builders.Doc {
  if (Array.isArray(doc)) {
    return doc.map((innerDoc) => recursivelyMapDoc(innerDoc, callback));
  }

  if (typeof doc === 'object') {
    if (doc.type === 'line') {
      return callback(doc.soft ? '' : ' ');
    }

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

    const nextDoc = { ...doc } as Record<string, unknown>;
    for (const [key, value] of Object.entries(nextDoc)) {
      if (value && typeof value === 'object') {
        nextDoc[key] = recursivelyMapDoc(value as builders.Doc, callback);
      }
    }

    return nextDoc as unknown as builders.Doc;
  }

  return callback(doc);
}

function createModifiedHtmlPlugin(html: Plugin): Plugin {
  const modifiedHtml = { ...html };
  if (modifiedHtml.printers) {
    const previousPrint = modifiedHtml.printers.html.print;
    modifiedHtml.printers.html.print = (path, options, print, args) => {
      const node = getHtmlNode(
        path as Parameters<NonNullable<Plugin['printers']>['html']['print']>[0],
      );

      const rawPrintingResult = previousPrint(path, options, print, args);

      if (
        node?.type === 'ieConditionalComment' ||
        node?.kind === 'ieConditionalComment'
      ) {
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

  return modifiedHtml;
}

const importPrettier = async () => {
  const [{ format }, html] = await Promise.all([
    import('prettier/standalone'),
    import('prettier/plugins/html'),
  ]);

  return { format, html: createModifiedHtmlPlugin(html as Plugin) };
};

/**
 * Prettier is only loaded the first time `pretty` is called, so importing
 * `render` doesn't load it when `pretty` is never used. This also keeps
 * bundlers that externalize `prettier` (e.g. Next.js with Turbopack) from
 * trying to resolve it at runtime unless it's actually needed.
 */
let prettierPromise: ReturnType<typeof importPrettier> | undefined;

const defaults: Options = {
  endOfLine: 'lf',
  tabWidth: 2,
  bracketSameLine: true,
  parser: 'html',
};

export const pretty = async (str: string, options: Options = {}) => {
  prettierPromise ??= importPrettier();
  const { format, html } = await prettierPromise;

  return format(str.replaceAll('\0', ''), {
    ...defaults,
    plugins: [html],
    ...options,
  });
};
