import type { HtmlToTextOptions } from 'html-to-text';
import type { toPlainText } from './utils/to-plain-text';

export type Options = {
  /**
   * @deprecated This option will be removed in a future major release.
   * Please format the rendered HTML yourself instead of relying on this option.
   *
   * @example
   * ```ts
   * // Render the email to HTML
   * const html = await render(email);
   *
   * // Format the HTML using your preferred formatter (e.g. Prettier)
   * const formattedHtml = await format(html);
   * ```
   *
   * @see https://github.com/resend/react-email/issues/2426
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
