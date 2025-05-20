import * as React from 'react';

export type SectionProps = Readonly<React.ComponentPropsWithoutRef<'table'>>;

export const Section = React.forwardRef<HTMLTableElement, SectionProps>(
  ({ children, style = {}, ...props }, ref) => {
    // Destructure padding to improve compatibility with Klavyio and Outlook.
    const {
      padding,
      paddingTop,
      paddingRight,
      paddingBottom,
      paddingLeft,
      ...tableStyle
    } = style;

    const tdStyle = {
      padding,
      paddingTop,
      paddingRight,
      paddingBottom,
      paddingLeft,
    };

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
        style={tableStyle}
      >
        <tbody>
          <tr>
            <td style={tdStyle}>{children}</td>
          </tr>
        </tbody>
      </table>
    );
  },
);

Section.displayName = 'Section';
