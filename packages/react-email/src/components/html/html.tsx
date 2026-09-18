import * as React from 'react';
import {
  markAsEmailContextProvider,
  provideEmailContext,
  stripEmailContexts,
} from '../email-context/index.js';
import { htmlContext } from './html-context.js';

export type HtmlProps = Readonly<React.ComponentPropsWithoutRef<'html'>>;

export const Html = React.forwardRef<HTMLHtmlElement, HtmlProps>(
  ({ children, lang = 'en', dir = 'ltr', ...props }, ref) => (
    <html {...stripEmailContexts(props)} dir={dir} lang={lang} ref={ref}>
      {provideEmailContext(htmlContext, { lang, dir }, children, props)}
    </html>
  ),
);

Html.displayName = 'Html';
markAsEmailContextProvider(Html);
