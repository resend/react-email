import type { HtmlToTextOptions } from 'html-to-text';

export type Options = {
  pretty?: boolean;
} & (
  | {
      plainText?: false;
    }
  | {
      plainText?: true;
      /**
       * These are options you can pass down directly to the library we use for
       * converting the rendered email's HTML into plain text.
       *
       * @see https://github.com/html-to-text/node-html-to-text
       */
      htmlToTextOptions?: HtmlToTextOptions;
    }
);
