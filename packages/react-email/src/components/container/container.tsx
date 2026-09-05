import * as React from 'react';
import { markAsElement } from '../element-marker.js';

export type ContainerProps = Readonly<React.ComponentPropsWithoutRef<'table'>>;

export const Container = React.forwardRef<HTMLTableElement, ContainerProps>(
  ({ children, style = {}, ...props }, ref) => {
    // Keep all styles (including padding) on <table> so that Tailwind responsive
    // class variants (e.g. max-sm:px-5) can override base classes (e.g. px-9)
    // that land on the same element. Previously padding was split to <td> for
    // Klaviyo/Outlook, but that caused responsive overrides to fail because
    // the responsive class was applied to <table> while base padding was on <td>.
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
        style={{ maxWidth: '37.5em', ...style }}
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
markAsElement(Container);
