import type { CSSProperties } from 'react';
import * as React from 'react';
import { borderParser } from '../../render/src/shared/utils/border-parser';

export type SectionProps = Readonly<React.ComponentPropsWithoutRef<'table'>>;

export const Section = React.forwardRef<HTMLTableElement, SectionProps>(
  ({ children, style, ...props }, ref) => {
    const sectionStyle = {
      ...style,
    };

    if (sectionStyle.border && typeof sectionStyle.border === 'string') {
      const { borderWidth, borderColor } = borderParser(sectionStyle.border);

      const containerStyle: CSSProperties = {
        backgroundColor: borderColor,
        width: '100%',
      };

      const cellStyle: CSSProperties = {
        padding: `${borderWidth}px`,
      };

      const contentStyle: CSSProperties = {
        ...sectionStyle,
        border: undefined,
        width: '100%',
        backgroundColor: sectionStyle.backgroundColor,
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
        ref={ref}
        style={sectionStyle}
        border={0}
        cellPadding="0"
        cellSpacing="0"
        role="presentation"
      >
        <tbody>
          <tr>
            <td>{children}</td>
          </tr>
        </tbody>
      </table>
    );
  },
);

Section.displayName = 'Section';
