import type { HtmlToTextOptions } from 'html-to-text';
import type { pretty } from './utils/pretty';
import type { toPlainText } from './utils/to-plain-text';

export type Options = {
  /**
   * @see {@link pretty}
   */
  pretty?: boolean;
} & (
  | {
      /**
       * @see {@link toPlainText}
       */
      plainText?: false;
    }
  | {
      /**
       * @see {@link toPlainText}
       */
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
