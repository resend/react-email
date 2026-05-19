import * as React from 'react';

export interface TextFieldProps extends React.ComponentProps<'input'> {}

export const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(
  function TextField({ className, ...rest }, ref) {
    return (
      <input
        ref={ref}
        data-re-inspector-input=""
        className={className}
        {...rest}
      />
    );
  },
);
