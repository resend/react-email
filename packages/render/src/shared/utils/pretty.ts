import type { Options, Plugin } from 'prettier';
import html from 'prettier/plugins/html';
import { format } from 'prettier/standalone';

const modifiedHtml = { ...html } as Plugin;
if (modifiedHtml.printers) {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const previousPrint = modifiedHtml.printers.html.print;
  modifiedHtml.printers.html.print = (path, options, print, args) => {
    const node = path.getNode() as {
      type: string;
      sourceSpan: {
        start: { file: unknown[]; offset: number; line: number; col: number };
        end: { file: unknown[]; offset: number; line: number; col: number };
        details: null;
      };
    };

    if (node.type === 'ieConditionalComment') {
      return options.originalText.slice(
        node.sourceSpan.start.offset,
        node.sourceSpan.end.offset,
      );
    }
    return previousPrint(path, options, print, args);
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
