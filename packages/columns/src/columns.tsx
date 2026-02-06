import { Column } from '@react-email/column';
import { Row } from '@react-email/row';
import * as React from 'react';

export type ColumnsProps = Readonly<
  Omit<React.ComponentPropsWithoutRef<typeof Row>, 'children'> & {
    /** Number of columns (default: number of children). */
    cols?: number;
    /** Space between columns (number as px, or string). Applied as padding on cells. */
    gap?: string | number;
    /** Explicit width per column (e.g. ['50%', '50%'] or ['60%', '40%']). */
    columnWidths?: string[];
    children: React.ReactNode;
  }
>;

export const Columns = React.forwardRef<HTMLTableElement, ColumnsProps>(
  (
    { children, cols: colsProp, gap = 0, columnWidths, style, ...props },
    ref,
  ) => {
    const items = React.Children.toArray(children);
    const cols = colsProp ?? items.length;
    const halfGap =
      typeof gap === 'number' ? `${gap / 2}px` : `calc(${gap} / 2)`;

    const widths: string[] =
      columnWidths && columnWidths.length >= items.length
        ? columnWidths.slice(0, items.length)
        : Array.from({ length: items.length }, () => `${100 / cols}%`);

    return (
      <Row ref={ref} style={style} {...props}>
        {items.map((child, index) => (
          <Column
            key={index}
            style={{
              width: widths[index],
              verticalAlign: 'top',
              paddingLeft: index === 0 ? undefined : halfGap,
              paddingRight: index === items.length - 1 ? undefined : halfGap,
            }}
          >
            {child}
          </Column>
        ))}
      </Row>
    );
  },
);

Columns.displayName = 'Columns';
