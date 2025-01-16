import * as React from 'react';

export type ContainerProps = Readonly<React.ComponentPropsWithoutRef<'table'>>;

export const Container = React.forwardRef<HTMLTableElement, ContainerProps>(
  ({ children, style, ...props }, ref) => {
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
        style={{ maxWidth: '37.5em', ...style }}
      >
        <tbody>
          <tr style={{ width: '100%' }}>
            <td>{children}</td>
          </tr>
        </tbody>
      </table>
    );
  },
);

Container.displayName = 'Container';
