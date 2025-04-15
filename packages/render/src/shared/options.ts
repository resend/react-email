import type { HtmlToTextOptions } from 'html-to-text';
// biome-ignore lint/correctness/noUnusedImports: this is used in the deprecated doc
import type { pretty } from './utils/pretty';

export type Options =
  | {
    plainText?: false;
    /**
     * @deprecated use {@link pretty} instead
     */
    pretty?: boolean;
  }
  | {
    plainText?: true;
    /**
     * @deprecated use {@link pretty} instead
     */
    pretty?: boolean;
    /**
     * These are options you can pass down directly to the library we use for
     * converting the rendered email's HTML into plain text.
     *
     * @see https://github.com/html-to-text/node-html-to-text
     */
    htmlToTextOptions?: HtmlToTextOptions;
  };
