import { Column } from '@react-email/column';
import { Row } from '@react-email/row';
import * as React from 'react';

function gapToCss(gap: string | number): string {
  if (typeof gap === 'number') return `${gap}px`;
  return String(gap);
}

export type StackProps = Readonly<
  Omit<React.ComponentPropsWithoutRef<typeof Row>, 'children'> & {
    /** Spacing between stacked children (number as px, or string e.g. '16px'). */
    gap?: string | number;
    children: React.ReactNode;
  }
>;

export const Stack = React.forwardRef<HTMLTableElement, StackProps>(
  ({ children, gap = 0, style, ...props }, ref) => {
    const items = React.Children.toArray(children);
    const gapCss = gapToCss(gap);

    return (
      <>
        {items.map((child, index) => (
          <Row
            key={index}
            ref={index === 0 ? ref : undefined}
            style={{
              ...(index < items.length - 1 ? { marginBottom: gapCss } : {}),
              ...style,
            }}
            {...props}
          >
            <Column style={{ verticalAlign: 'top' }}>{child}</Column>
          </Row>
        ))}
      </>
    );
  },
);

Stack.displayName = 'Stack';
