import * as React from 'react';
import { markAsElement } from '../element-marker.js';
import {
  splitPaddingClassNames,
  splitPaddingStyles,
} from '../utils/split-padding-props.js';

export type SectionProps = Readonly<React.ComponentPropsWithoutRef<'table'>>;

export const Section = React.forwardRef<HTMLTableElement, SectionProps>(
  ({ children, style = {}, className, ...props }, ref) => {
    // Split padding styles/classes onto the inner <td> for Outlook/Klaviyo, and so
    // Tailwind media-query padding variants override base padding on the same
    // element (https://github.com/resend/react-email/issues/3693).
    const { tdStyle, tableStyle } = splitPaddingStyles(style);
    const { tdClassName, tableClassName } = splitPaddingClassNames(className);

    return (
      <table
        align="center"
        width="100%"
        border={0}
        cellPadding="0"
        cellSpacing="0"
        role="presentation"
        {...props}
        ref={ref}
        className={tableClassName}
        style={tableStyle}
      >
        <tbody>
          <tr>
            <td className={tdClassName} style={tdStyle}>
              {children}
            </td>
          </tr>
        </tbody>
      </table>
    );
  },
);

Section.displayName = 'Section';
markAsElement(Section);
