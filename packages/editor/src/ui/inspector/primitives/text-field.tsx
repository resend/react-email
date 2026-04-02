import * as React from 'react';

function Root({ children, className, ...rest }: React.ComponentProps<'div'>) {
  return (
    <div data-re-inspector-text-field="" className={className} {...rest}>
      {children}
    </div>
  );
}

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(
  function Input({ className, ...rest }, ref) {
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

function Slot({ children, ...rest }: React.ComponentProps<'div'>) {
  return (
    <div data-re-inspector-text-field-slot="" {...rest}>
      {children}
    </div>
  );
}

export const TextField = { Root, Input, Slot };
