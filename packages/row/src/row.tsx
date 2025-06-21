import type { CSSProperties } from 'react';
import * as React from 'react';
import { borderParser } from '../../render/src/shared/utils/border-parser';

export type RowProps = Readonly<
  React.ComponentPropsWithoutRef<'table'> & {
    children: React.ReactNode;
  }
>;

export const Row = React.forwardRef<HTMLTableElement, RowProps>(
  ({ children, style, ...props }, ref) => {
    const rowStyle = {
      ...style,
    };

    if (rowStyle.border && typeof rowStyle.border === 'string') {
      const { borderWidth, borderColor } = borderParser(rowStyle.border);

      const containerStyle: CSSProperties = {
        backgroundColor: borderColor,
        width: '100%',
      };

      const cellStyle: CSSProperties = {
        padding: `${borderWidth}px`,
      };

      const contentStyle: CSSProperties = {
        ...rowStyle,
        border: undefined,
        width: '100%',
        backgroundColor: rowStyle.backgroundColor,
      };

      return (
        <table
          {...props}
          ref={ref}
          style={containerStyle}
          align="center"
          border={0}
          cellPadding={0}
          cellSpacing={0}
          role="presentation"
          width="100%"
        >
          <tbody>
            <tr>
              <td style={cellStyle}>
                <table
                  style={contentStyle}
                  align="center"
                  border={0}
                  cellPadding={0}
                  cellSpacing={0}
                  role="presentation"
                  width="100%"
                >
                  <tbody style={{ width: '100%' }}>
                    <tr style={{ width: '100%' }}>{children}</tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      );
    }
    return (
      <table
        align="center"
        width="100%"
        {...props}
        border={0}
        cellPadding="0"
        cellSpacing="0"
        role="presentation"
        ref={ref}
        style={rowStyle}
      >
        <tbody style={{ width: '100%' }}>
          <tr style={{ width: '100%' }}>{children}</tr>
        </tbody>
      </table>
    );
  },
);

Row.displayName = 'Row';
