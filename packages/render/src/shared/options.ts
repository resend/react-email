import type { HtmlToTextOptions } from 'html-to-text';
// biome-ignore lint/correctness/noUnusedImports: this is used in the deprecated doc
import type { pretty } from './utils/pretty';

export type Options = {
  /**
   * @deprecated use {@link pretty} instead
   */
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
