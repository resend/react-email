import * as React from 'react';
import { markAsElement } from '../element-marker.js';
import {
  splitPaddingClassNames,
  splitPaddingStyles,
} from '../utils/split-padding-props.js';

export type ContainerProps = Readonly<React.ComponentPropsWithoutRef<'table'>>;

export const Container = React.forwardRef<HTMLTableElement, ContainerProps>(
  ({ children, style = {}, className, ...props }, ref) => {
    // Same padding split as Section — media-query padding classes must land on
    // the <td> with base padding (https://github.com/resend/react-email/issues/3693).
    const { tdStyle, tableStyle } = splitPaddingStyles(style);
    const { tdClassName, tableClassName } = splitPaddingClassNames(className);

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
        className={tableClassName}
        style={{ maxWidth: '37.5em', ...tableStyle }}
      >
        <tbody>
          <tr style={{ width: '100%' }}>
            <td className={tdClassName} style={tdStyle}>
              {children}
            </td>
          </tr>
        </tbody>
      </table>
    );
  },
);

Container.displayName = 'Container';
markAsElement(Container);
