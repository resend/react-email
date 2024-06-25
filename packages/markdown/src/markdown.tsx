import type { StylesType } from "md-to-react-email";
import { parseMarkdownToJSX } from "md-to-react-email";
import * as React from "react";

export interface MarkdownProps {
  children: string;
  markdownCustomStyles?: StylesType;
  markdownContainerStyles?: React.CSSProperties;
}

export const Markdown = React.forwardRef<
  React.ElementRef<"div">,
  Readonly<MarkdownProps>
>(
  (
    { children, markdownContainerStyles, markdownCustomStyles, ...props },
    ref,
  ) => {
    const parsedMarkdown = parseMarkdownToJSX({
      markdown: children,
      customStyles: markdownCustomStyles,
    });

    return (
      <div
        {...props}
        dangerouslySetInnerHTML={{ __html: parsedMarkdown }}
        data-id="react-email-markdown"
        ref={ref}
        style={markdownContainerStyles}
      />
    );
  },
);

Markdown.displayName = "Markdown";
