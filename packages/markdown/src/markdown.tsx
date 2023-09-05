import { StylesType, parseMarkdownToReactEmailJSX } from 'md-to-react-email';
import * as React from 'react';

type MarkdownElement = React.ElementRef<'div'>;

export interface MarkdownProps {
  children: string;
  markdownContainerStyles?: React.CSSProperties;
  markdownCustomStyles?: StylesType;
  showDataId?: boolean;
}

export const Markdown = React.forwardRef<MarkdownElement, MarkdownProps>(
  (
    { children, markdownContainerStyles, markdownCustomStyles, showDataId = false, ...props },
    forwardedRef
  ) => {
    const parsedMarkdown = parseMarkdownToReactEmailJSX({
      customStyles: markdownCustomStyles,
      markdown: children,
      withDataAttr: showDataId
    });

    return (
      <div
        {...props}
        ref={forwardedRef}
        data-id="react-email-markdown"
        style={markdownContainerStyles}
        dangerouslySetInnerHTML={{ __html: parsedMarkdown }}
      />
    );
  }
);

Markdown.displayName = 'Markdown';
