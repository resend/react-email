import * as React from 'react';

type SectionElement = React.ElementRef<'table'>;
type RootProps = React.ComponentPropsWithoutRef<'table'>;

export interface SectionProps extends RootProps {
  style?: React.CSSProperties;
}

type ReactEmailChild = {
  type?: {
    displayName?: string;
  }
} & React.ReactNode;

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

    const arrayChildren = React.Children.toArray(children);

    const hasTdElement = (child: ReactEmailChild) => {
      return React.isValidElement(child) && (child.type === "td" || child.type.displayName === "Column");
    };
  
    const finalChildren = arrayChildren.map((child: ReactEmailChild, index) => {
      return hasTdElement(child) ? child : <td key={index}>{child}</td>;
    });


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
          <tr style={styleDefaultTr}>{finalChildren}</tr>
        </tbody>
      </table>
    );
  },
);

Section.displayName = 'Section';
