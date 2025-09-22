import type { HtmlToTextOptions } from 'html-to-text';
import type { pretty } from './utils/pretty';
import type { toPlainText } from './utils/to-plain-text';

export type Options = {
  /**
   * @deprecated use {@link pretty} instead
   */
  pretty?: boolean;
} & (
  | {
      /**
       * @deprecated use {@link toPlainText} instead
       */
      plainText?: false;
    }
  | {
      /**
       * @deprecated use {@link toPlainText} instead
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
