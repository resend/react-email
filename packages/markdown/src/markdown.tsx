import type { StylesType } from "md-to-react-email";
import { parseMarkdownToReactEmailJSX } from "md-to-react-email";
import * as React from "react";

export interface MarkdownProps {
  children: string;
  markdownCustomStyles?: StylesType;
  markdownContainerStyles?: React.CSSProperties;
  showDataId?: boolean;
}

export const Markdown = React.forwardRef<
  React.ElementRef<"div">,
  Readonly<MarkdownProps>
>(
  (
    {
      children,
      markdownContainerStyles,
      markdownCustomStyles,
      showDataId = false,
      ...props
    },
    ref,
  ) => {
    const parsedMarkdown = parseMarkdownToReactEmailJSX({
      markdown: children,
      customStyles: markdownCustomStyles,
      withDataAttr: showDataId,
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
