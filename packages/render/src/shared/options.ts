import type { HtmlToTextOptions } from 'html-to-text';
import type { pretty } from './utils/pretty';
import type { toPlainText } from './utils/to-plain-text';
import type { unstableToPlainText } from './utils/to-plain-text-unstable';

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
      unstableTextConversion?: false;
    }
  | {
      plainText?: true;
      /**
       * Converts to plain text with an in-house formatter instead of
       * html-to-text, so it doesn't take `htmlToTextOptions`. This is the
       * path we intend to make the default in a future major version — try
       * it and report anything that renders differently.
       *
       * @see {@link unstableToPlainText}
       */
      unstableTextConversion: true;
    }
);
