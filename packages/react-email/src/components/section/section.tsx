import * as React from 'react';
import { markAsElement } from '../element-marker.js';

export type SectionProps = Readonly<React.ComponentPropsWithoutRef<'table'>>;

export const Section = React.forwardRef<HTMLTableElement, SectionProps>(
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
        border={0}
        cellPadding="0"
        cellSpacing="0"
        role="presentation"
        {...props}
        ref={ref}
        style={style}
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
markAsElement(Section);
