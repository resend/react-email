import { createEmailContext } from '../email-context/index.js';

export interface HtmlContextValue {
  lang?: string;
  dir?: string;
}

/**
 * Carries the language metadata set on `<Html>` down to components that
 * repeat it for email clients that strip the `<html>` tag, such as `<Body>`.
 */
export const htmlContext = createEmailContext<HtmlContextValue>('html', {});
