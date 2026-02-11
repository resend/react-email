import { Column } from '@react-email/column';
import { Row } from '@react-email/row';
import * as React from 'react';

function gapToCss(gap: string | number): string {
  if (typeof gap === 'number') return `${gap}px`;
  return String(gap);
}

export type ColumnsProps = Readonly<
  Omit<React.ComponentPropsWithoutRef<typeof Row>, 'children'> & {
    /** Number of columns (default: number of children). */
    cols?: number;
    /**
     * Space between columns (number as px, or string).
     * Uses spacer cells + calc() widths so total width stays 100% (avoids overflow in Outlook).
     * Note: Outlook desktop does not support calc(); it will still show the gap and approximate column widths.
     */
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
    const hasGap = gap !== 0 && gap !== undefined;
    const gapCss = gapToCss(gap);

    const n = items.length;
    const totalGapCss =
      n <= 1
        ? '0px'
        : typeof gap === 'number'
          ? `${(n - 1) * gap}px`
          : `calc(${n - 1} * (${gapCss}))`;

    const contentWidths: string[] =
      columnWidths && columnWidths.length >= n
        ? columnWidths.slice(0, n).map((w) => {
            const pct = Number.parseFloat(w);
            if (!hasGap || !Number.isFinite(pct)) return w;
            const fraction = pct / 100;
            return `calc((100% - ${totalGapCss}) * ${fraction})`;
          })
        : Array.from({ length: n }, () =>
            hasGap
              ? `calc((100% - ${totalGapCss}) / ${cols})`
              : `${100 / cols}%`,
          );

    if (!hasGap) {
      return (
        <Row ref={ref} style={style} {...props}>
          {items.map((child, index) => (
            <Column
              key={index}
              style={{
                width: contentWidths[index],
                verticalAlign: 'top',
              }}
            >
              {child}
            </Column>
          ))}
        </Row>
      );
    }

    const cells: React.ReactNode[] = [];
    items.forEach((child, index) => {
      cells.push(
        <Column
          key={`col-${index}`}
          style={{
            width: contentWidths[index],
            verticalAlign: 'top',
          }}
        >
          {child}
        </Column>,
      );
      if (index < items.length - 1) {
        cells.push(
          <Column
            key={`gap-${index}`}
            style={{
              width: gapCss,
              minWidth: gapCss,
              padding: 0,
              verticalAlign: 'top',
            }}
          >
            {'\u00A0'}
          </Column>,
        );
      }
    });

    return (
      <Row ref={ref} style={style} {...props}>
        {cells}
      </Row>
    );
  },
);

Columns.displayName = 'Columns';
