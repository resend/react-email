import * as React from 'react';

export interface TextareaProps extends React.ComponentProps<'textarea'> {}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea({ className, ...rest }, ref) {
    return (
      <textarea
        ref={ref}
        data-re-inspector-input=""
        data-type="textarea"
        className={className}
        {...rest}
      />
    );
  },
);
