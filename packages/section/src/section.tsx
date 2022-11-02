import * as React from 'react';

type SectionElement = React.ElementRef<'table'>;
type RootProps = React.ComponentPropsWithoutRef<'table'>;

export interface SectionProps extends RootProps {
  style?: React.CSSProperties;
}

export const Section = React.forwardRef<SectionElement, Readonly<SectionProps>>(
  ({ children, style, ...props }, forwardedRef) => {
    const styleDefault = {
      width: '100%',
      ...style,
    };

    return (
      <table
        ref={forwardedRef}
        style={styleDefault}
        align="center"
        border={0}
        cellPadding={0}
        cellSpacing={0}
        role="presentation"
        {...props}
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
