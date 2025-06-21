import type { CSSProperties } from 'react';
import * as React from 'react';
import { borderParser } from '../../render/src/shared/utils/border-parser';

export type ColumnProps = Readonly<React.ComponentPropsWithoutRef<'td'>>;

export const Column = React.forwardRef<HTMLTableCellElement, ColumnProps>(
  ({ children, style, ...props }, ref) => {
    const columnStyle = {
      ...style,
    };

    if (columnStyle.border && typeof columnStyle.border === 'string') {
      const { borderWidth, borderColor } = borderParser(columnStyle.border);

      const tdStyle: CSSProperties = { ...columnStyle };
      delete tdStyle.border;
      delete tdStyle.backgroundColor;

      const containerStyle: CSSProperties = {
        backgroundColor: borderColor,
        width: '100%',
      };

      const cellStyle: CSSProperties = {
        padding: `${borderWidth}px`,
      };

      const contentStyle: CSSProperties = {
        ...columnStyle,
        border: undefined,
        width: '100%',
        backgroundColor: columnStyle.backgroundColor,
      };

      return (
        <td {...props} ref={ref} data-id="__react-email-column" style={tdStyle}>
          <table
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
                    <tbody>
                      <tr>
                        <td>{children}</td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
        </td>
      );
    }
    return (
      <td
        {...props}
        data-id="__react-email-column"
        ref={ref}
        style={columnStyle}
      >
        {children}
      </td>
    );
  },
);

Column.displayName = 'Column';
