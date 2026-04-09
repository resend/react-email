import * as React from 'react';

export type ContainerProps = Readonly<React.ComponentPropsWithoutRef<'table'>>;

export const Container = React.forwardRef<HTMLTableElement, ContainerProps>(
  ({ children, style = {}, ...props }, ref) => {
    // Split padding styles to improve compatibility with Klavyio and Outlook,
    // while preserving user-provided style property order without allocating
    // entry arrays on each render.
    const tdStyle: React.CSSProperties = {};
    const tableStyle: React.CSSProperties = {};

    const styleRecord = style as Record<string, unknown>;

    for (const key in styleRecord) {
      if (!Object.prototype.hasOwnProperty.call(styleRecord, key)) {
        continue;
      }

      const value = styleRecord[key];

      if (
        key === 'padding' ||
        key === 'paddingTop' ||
        key === 'paddingRight' ||
        key === 'paddingBottom' ||
        key === 'paddingLeft'
      ) {
        (tdStyle as Record<string, unknown>)[key] = value;
      } else {
        (tableStyle as Record<string, unknown>)[key] = value;
      }
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
