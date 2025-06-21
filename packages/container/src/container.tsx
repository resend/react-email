import type { CSSProperties } from 'react';
import * as React from 'react';
import { borderParser } from '../../render/src/shared/utils/border-parser';

export type ContainerProps = Readonly<React.ComponentPropsWithoutRef<'table'>>;

export const Container = React.forwardRef<HTMLTableElement, ContainerProps>(
  ({ children, style, ...props }, ref) => {
    const containerStyle = {
      maxWidth: '37.5em',
      ...style,
    };

    if (containerStyle.border && typeof containerStyle.border === 'string') {
      const { borderWidth, borderColor } = borderParser(containerStyle.border);

      const newContainerStyle: CSSProperties = {
        backgroundColor: borderColor,
        width: '100%',
      };

      const cellStyle: CSSProperties = {
        padding: `${borderWidth}px`,
      };

      const contentStyle: CSSProperties = {
        ...containerStyle,
        border: undefined,
        width: '100%',
        backgroundColor: containerStyle.backgroundColor,
      };

      return (
        <table
          {...props}
          ref={ref}
          style={newContainerStyle}
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
        ref={ref}
        role="presentation"
        style={containerStyle}
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
