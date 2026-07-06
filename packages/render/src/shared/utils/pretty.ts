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

// prettier is an optional peer dependency. It is only needed when rendering with
// `pretty: true` (off by default), so importing it unconditionally forced an
// ~8MB dependency on every consumer, including backends that never prettify. We
// load it lazily so it stays out of installs and bundles unless it is actually
// installed and a caller opts into pretty output.
interface LoadedPrettier {
  format: typeof import('prettier/standalone').format;
  defaults: Options;
}

let loaded: LoadedPrettier | null | undefined;
let warnedMissingPrettier = false;

async function loadPrettier(): Promise<LoadedPrettier | null> {
  if (loaded !== undefined) {
    return loaded;
  }

  try {
    const [{ format }, html] = await Promise.all([
      import('prettier/standalone'),
      import('prettier/plugins/html'),
    ]);

    const modifiedHtml = { ...html } as Plugin;
    if (modifiedHtml.printers) {
      const previousPrint = modifiedHtml.printers.html.print;
      modifiedHtml.printers.html.print = (path, options, print, args) => {
        const node = getHtmlNode(
          path as Parameters<
            NonNullable<Plugin['printers']>['html']['print']
          >[0],
        );

        const rawPrintingResult = previousPrint(path, options, print, args);

        if (
          node?.type === 'ieConditionalComment' ||
          node?.kind === 'ieConditionalComment'
        ) {
          return recursivelyMapDoc(rawPrintingResult, (doc) => {
            if (typeof doc === 'object' && doc.type === 'line') {
              return doc.soft ? '' : ' ';
            }

            return doc;
          });
        }

        return rawPrintingResult;
      };
    }

    loaded = {
      format,
      defaults: {
        endOfLine: 'lf',
        tabWidth: 2,
        plugins: [modifiedHtml],
        bracketSameLine: true,
        parser: 'html',
      },
    };
  } catch {
    loaded = null;
  }

  return loaded;
}

export const pretty = async (str: string, options: Options = {}) => {
  const sanitized = str.replaceAll('\0', '');
  const prettier = await loadPrettier();

  // prettier is not installed: return the HTML unformatted (semantically
  // identical, only cosmetic whitespace is skipped) and warn once so it is
  // clear why `pretty` had no effect.
  if (!prettier) {
    if (!warnedMissingPrettier) {
      warnedMissingPrettier = true;
      console.warn(
        '[@react-email/render] `pretty` was requested but `prettier` is not installed, so the HTML is returned unformatted. Install `prettier` to enable pretty output.',
      );
    }
    return sanitized;
  }

  return prettier.format(sanitized, {
    ...prettier.defaults,
    ...options,
  });
};
