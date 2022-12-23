import * as React from 'react';

type SectionElement = React.ElementRef<'table'>;
type RootProps = React.ComponentPropsWithoutRef<'table'>;

export interface SectionProps extends RootProps {
  style?: React.CSSProperties;
}

export const Section = React.forwardRef<SectionElement, Readonly<SectionProps>>(
  ({ children, style, ...props }, forwardedRef) => {
    const styleDefaultTable = {
      width: '100%',
      ...style,
    };

    const styleDefaultTr = {
      display: 'grid',
      gridAutoColumns: 'minmax(0, 1fr)',
      gridAutoFlow: 'column',
    };

    return (
      <table
        ref={forwardedRef}
        style={styleDefaultTable}
        align="center"
        border={0}
        cellPadding={0}
        cellSpacing={0}
        role="presentation"
        {...props}
      >
        <tbody>
          <tr style={styleDefaultTr}>{children}</tr>
        </tbody>
      </table>
    );
  },
);

Section.displayName = 'Section';
