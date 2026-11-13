import * as React from 'react';
import { markAsElement } from '../element-marker.js';

export type CodeInlineProps = Readonly<React.ComponentPropsWithoutRef<'code'>>;

export const CodeInline = React.forwardRef<HTMLElement, CodeInlineProps>(
  (props, ref) => <code {...props} ref={ref} />,
);

CodeInline.displayName = 'CodeInline';
markAsElement(CodeInline);
