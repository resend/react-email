import * as React from 'react';

export type ContainerProps = Readonly<React.ComponentPropsWithoutRef<'table'>>;

export const Container = React.forwardRef<HTMLTableElement, ContainerProps>(
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
        {...props}
        border={0}
        cellPadding="0"
        cellSpacing="0"
        ref={ref}
        role="presentation"
        style={{ maxWidth: '37.5em', ...tableStyle }}
      >
        <tbody>
          <tr style={{ width: '100%' }}>
            <td style={tdStyle}>{children}</td>
          </tr>
        </tbody>
      </table>
    );
  },
);

Container.displayName = 'Container';
